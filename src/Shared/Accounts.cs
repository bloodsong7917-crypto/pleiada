using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Pleiada;

/// <summary>
/// Учётные записи, команды и проекты. Когда подключено, доска доступна только участникам
/// команды, которой принадлежит проект. Данные лежат в accounts.json рядом с досками.
/// </summary>
public sealed class Accounts : IDisposable
{
    public sealed class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Salt { get; set; }
        public string Hash { get; set; }
        public DateTime Created { get; set; }
    }

    public sealed class Session
    {
        public string TokenHash { get; set; }
        public string UserId { get; set; }
        public DateTime Expires { get; set; }
    }

    public sealed class Member
    {
        public string UserId { get; set; }
        public string Role { get; set; }
    }

    public sealed class ProjectRef
    {
        public string Id { get; set; }
        public string By { get; set; }
        public DateTime Created { get; set; }
    }

    public sealed class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Invite { get; set; }
        public DateTime Created { get; set; }
        public List<Member> Members { get; set; } = new();
        public List<ProjectRef> Projects { get; set; } = new();
    }

    public sealed class Db
    {
        public List<User> Users { get; set; } = new();
        public List<Team> Teams { get; set; } = new();
        public List<Session> Sessions { get; set; } = new();
    }

    const string Cookie = "pl_session";
    const int Iterations = 210_000;
    const int MaxFailures = 8;
    static readonly TimeSpan SessionLife = TimeSpan.FromDays(30);
    static readonly TimeSpan FailureWindow = TimeSpan.FromMinutes(10);
    static readonly Regex EmailRx = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);
    static readonly JsonSerializerOptions Json = new() { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, WriteIndented = true };

    readonly BoardHub _hub;
    readonly string _file;
    readonly object _gate = new();
    readonly Dictionary<string, (int Count, DateTime Start)> _failures = new();
    readonly System.Threading.Timer _saver;
    Db _db = new();
    bool _dirty;

    public Accounts(BoardHub hub, string dataDir)
    {
        _hub = hub;
        _file = Path.Combine(dataDir, "accounts.json");
        if (File.Exists(_file)) _db = JsonSerializer.Deserialize<Db>(File.ReadAllText(_file)) ?? new Db();
        _db.Sessions.RemoveAll(s => s.Expires < DateTime.UtcNow);
        hub.Authorize = CanAccess;
        hub.PeerName = ctx => Auth(ctx)?.Name;
        _saver = new System.Threading.Timer(_ => Flush(), null, 1000, 1000);
    }

    public void Dispose()
    {
        _saver.Dispose();
        Flush();
    }

    void Flush()
    {
        string text;
        lock (_gate)
        {
            if (!_dirty) return;
            _dirty = false;
            text = JsonSerializer.Serialize(_db, Json);
        }
        try
        {
            File.WriteAllText(_file + ".tmp", text);
            File.Move(_file + ".tmp", _file, true);
        }
        catch (Exception ex)
        {
            lock (_gate) _dirty = true;
            Console.Error.WriteLine($"Не удалось сохранить учётные записи: {ex.Message}");
        }
    }

    // ---------- пароли и сессии ----------

    static string NewId(int n)
    {
        const string abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var sb = new StringBuilder(n);
        for (var i = 0; i < n; i++) sb.Append(abc[RandomNumberGenerator.GetInt32(abc.Length)]);
        return sb.ToString();
    }

    static byte[] Derive(string password, byte[] salt) =>
        Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, 32);

    static string TokenHash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    User Auth(HttpContext ctx)
    {
        if (!ctx.Request.Cookies.TryGetValue(Cookie, out var token) || string.IsNullOrEmpty(token)) return null;
        var hash = TokenHash(token);
        lock (_gate)
        {
            var s = _db.Sessions.Find(x => x.TokenHash == hash);
            if (s == null || s.Expires < DateTime.UtcNow) return null;
            return _db.Users.Find(u => u.Id == s.UserId);
        }
    }

    void SignIn(HttpContext ctx, User user)
    {
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        lock (_gate)
        {
            _db.Sessions.RemoveAll(s => s.Expires < DateTime.UtcNow);
            _db.Sessions.Add(new Session { TokenHash = TokenHash(token), UserId = user.Id, Expires = DateTime.UtcNow + SessionLife });
            _dirty = true;
        }
        ctx.Response.Cookies.Append(Cookie, token, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = ctx.Request.IsHttps || ctx.Request.Headers["X-Forwarded-Proto"] == "https",
            MaxAge = SessionLife,
            Path = "/",
        });
    }

    bool CanAccess(HttpContext ctx, string room)
    {
        var user = Auth(ctx);
        if (user == null) return false;
        lock (_gate) return TeamOf(room, user.Id) != null;
    }

    // Под _gate.
    Team TeamOf(string room, string userId) =>
        _db.Teams.Find(t => t.Projects.Exists(p => p.Id == room) && t.Members.Exists(m => m.UserId == userId));

    static string Role(Team t, string userId) => t.Members.Find(m => m.UserId == userId)?.Role;

    // ---------- http ----------

    static IResult Fail(int status, string error) => Results.Json(new { error }, statusCode: status);

    static async Task<JsonObject> Body(HttpContext ctx)
    {
        if (ctx.Request.ContentLength is null or > 16 * 1024) return null;
        try { return await JsonSerializer.DeserializeAsync<JsonObject>(ctx.Request.Body); }
        catch (JsonException) { return null; }
    }

    static string Str(JsonObject o, string key) =>
        o?[key] is JsonValue v && v.TryGetValue<string>(out var s) ? s.Trim() : "";

    static object Me(User u) => new { id = u.Id, name = u.Name, email = u.Email };

    bool Throttled(string key)
    {
        lock (_gate)
        {
            if (_failures.Count > 5000) _failures.Clear();
            return _failures.TryGetValue(key, out var f) && DateTime.UtcNow - f.Start < FailureWindow && f.Count >= MaxFailures;
        }
    }

    void CountFailure(string key)
    {
        lock (_gate)
        {
            var f = _failures.GetValueOrDefault(key);
            _failures[key] = DateTime.UtcNow - f.Start < FailureWindow ? (f.Count + 1, f.Start) : (1, DateTime.UtcNow);
        }
    }

    object Describe(Team t, string userId)
    {
        // Под _gate.
        var role = Role(t, userId);
        return new
        {
            id = t.Id,
            name = t.Name,
            role,
            invite = role == "owner" ? t.Invite : null,
            members = t.Members.Select(m =>
            {
                var u = _db.Users.Find(x => x.Id == m.UserId);
                return new { id = m.UserId, name = u?.Name ?? "?", email = u?.Email ?? "", role = m.Role };
            }),
            projects = t.Projects.Select(p =>
            {
                var (name, updated, count) = _hub.Describe(p.Id);
                return new { id = p.Id, name, updated, count, by = p.By };
            }),
        };
    }

    public void Map(WebApplication app)
    {
        // Запросы, меняющие данные, и веб-сокеты принимаем только со своего сайта.
        app.Use(async (ctx, next) =>
        {
            var origin = (string)ctx.Request.Headers.Origin;
            var guarded = !HttpMethods.IsGet(ctx.Request.Method) || ctx.WebSockets.IsWebSocketRequest;
            if (guarded && !string.IsNullOrEmpty(origin) &&
                !(Uri.TryCreate(origin, UriKind.Absolute, out var o) && string.Equals(o.Authority, ctx.Request.Host.Value, StringComparison.OrdinalIgnoreCase)))
            {
                ctx.Response.StatusCode = 403;
                return;
            }
            await next();
        });

        app.MapPost("/api/auth/register", async (HttpContext ctx) =>
        {
            var b = await Body(ctx);
            string name = Str(b, "name"), email = Str(b, "email").ToLowerInvariant(), password = b?["password"] is JsonValue pv && pv.TryGetValue<string>(out var p) ? p : "";
            if (name.Length is 0 or > 40) return Fail(400, "Укажите имя (до 40 символов)");
            if (email.Length > 254 || !EmailRx.IsMatch(email)) return Fail(400, "Некорректный адрес почты");
            if (password.Length is < 8 or > 200) return Fail(400, "Пароль должен быть не короче 8 символов");
            var ip = "reg|" + ctx.Connection.RemoteIpAddress;
            if (Throttled(ip)) return Fail(429, "Слишком много попыток. Попробуйте позже");
            CountFailure(ip);

            var salt = RandomNumberGenerator.GetBytes(16);
            var user = new User
            {
                Id = NewId(12), Name = name, Email = email, Created = DateTime.UtcNow,
                Salt = Convert.ToBase64String(salt), Hash = Convert.ToBase64String(Derive(password, salt)),
            };
            lock (_gate)
            {
                if (_db.Users.Exists(u => u.Email == email)) return Fail(409, "Этот адрес уже зарегистрирован");
                _db.Users.Add(user);
                _dirty = true;
            }
            SignIn(ctx, user);
            return Results.Json(Me(user));
        });

        app.MapPost("/api/auth/login", async (HttpContext ctx) =>
        {
            var b = await Body(ctx);
            string email = Str(b, "email").ToLowerInvariant(), password = b?["password"] is JsonValue pv && pv.TryGetValue<string>(out var p) ? p : "";
            var key = ctx.Connection.RemoteIpAddress + "|" + email;
            if (Throttled(key)) return Fail(429, "Слишком много попыток. Попробуйте через 10 минут");
            User user;
            lock (_gate) user = _db.Users.Find(u => u.Email == email);
            // Хэш считаем и для несуществующего адреса, чтобы по времени ответа нельзя было узнать, есть ли он.
            var salt = user != null ? Convert.FromBase64String(user.Salt) : new byte[16];
            var hash = Derive(password.Length > 200 ? "" : password, salt);
            if (user == null || !CryptographicOperations.FixedTimeEquals(hash, Convert.FromBase64String(user.Hash)))
            {
                CountFailure(key);
                return Fail(401, "Неверная почта или пароль");
            }
            SignIn(ctx, user);
            return Results.Json(Me(user));
        });

        app.MapPost("/api/auth/logout", (HttpContext ctx) =>
        {
            if (ctx.Request.Cookies.TryGetValue(Cookie, out var token))
            {
                var hash = TokenHash(token);
                lock (_gate) _dirty |= _db.Sessions.RemoveAll(s => s.TokenHash == hash) > 0;
            }
            ctx.Response.Cookies.Delete(Cookie);
            return Results.Ok();
        });

        app.MapGet("/api/me", (HttpContext ctx) => Auth(ctx) is { } u ? Results.Json(Me(u)) : Fail(401, "Требуется вход"));

        app.MapGet("/api/teams", (HttpContext ctx) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
                return Results.Json(_db.Teams.Where(t => Role(t, u.Id) != null)
                    .Select(t => new { id = t.Id, name = t.Name, role = Role(t, u.Id), members = t.Members.Count, projects = t.Projects.Count }).ToList());
        });

        app.MapPost("/api/teams", async (HttpContext ctx) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            var name = Str(await Body(ctx), "name");
            if (name.Length is 0 or > 60) return Fail(400, "Укажите название команды (до 60 символов)");
            var team = new Team { Id = NewId(12), Name = name, Invite = NewId(24), Created = DateTime.UtcNow };
            team.Members.Add(new Member { UserId = u.Id, Role = "owner" });
            lock (_gate)
            {
                if (_db.Teams.Count(t => Role(t, u.Id) == "owner") >= 50) return Fail(400, "Слишком много команд");
                _db.Teams.Add(team);
                _dirty = true;
            }
            return Results.Json(new { id = team.Id });
        });

        app.MapGet("/api/teams/{id}", (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Id == id);
                return t == null || Role(t, u.Id) == null ? Fail(404, "Команда не найдена") : Results.Json(Describe(t, u.Id));
            }
        });

        app.MapPost("/api/teams/{id}", async (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            var b = await Body(ctx);
            var name = Str(b, "name");
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Id == id);
                if (t == null || Role(t, u.Id) == null) return Fail(404, "Команда не найдена");
                if (Role(t, u.Id) != "owner") return Fail(403, "Это может сделать только владелец команды");
                if (b?["resetInvite"] is JsonValue r && r.TryGetValue<bool>(out var reset) && reset) t.Invite = NewId(24);
                else if (name.Length is 0 or > 60) return Fail(400, "Укажите название команды (до 60 символов)");
                else t.Name = name;
                _dirty = true;
                return Results.Json(Describe(t, u.Id));
            }
        });

        app.MapDelete("/api/teams/{id}", (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            List<string> rooms;
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Id == id);
                if (t == null || Role(t, u.Id) == null) return Fail(404, "Команда не найдена");
                if (Role(t, u.Id) != "owner") return Fail(403, "Это может сделать только владелец команды");
                rooms = t.Projects.Select(p => p.Id).ToList();
                _db.Teams.Remove(t);
                _dirty = true;
            }
            foreach (var room in rooms) _hub.Delete(room);
            return Results.Ok();
        });

        app.MapDelete("/api/teams/{id}/members/{userId}", (HttpContext ctx, string id, string userId) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Id == id);
                if (t == null || Role(t, u.Id) == null) return Fail(404, "Команда не найдена");
                var target = t.Members.Find(m => m.UserId == userId);
                if (target == null) return Fail(404, "Участник не найден");
                if (userId != u.Id && Role(t, u.Id) != "owner") return Fail(403, "Это может сделать только владелец команды");
                if (target.Role == "owner") return Fail(400, "Владелец не может покинуть команду — её можно только удалить");
                t.Members.Remove(target);
                _dirty = true;
            }
            return Results.Ok();
        });

        app.MapGet("/api/invites/{code}", (HttpContext ctx, string code) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Invite == code);
                return t == null ? Fail(404, "Приглашение недействительно") : Results.Json(new { id = t.Id, name = t.Name, member = Role(t, u.Id) != null });
            }
        });

        app.MapPost("/api/invites/{code}", (HttpContext ctx, string code) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Invite == code);
                if (t == null) return Fail(404, "Приглашение недействительно");
                if (Role(t, u.Id) == null)
                {
                    if (t.Members.Count >= 200) return Fail(400, "В команде слишком много участников");
                    t.Members.Add(new Member { UserId = u.Id, Role = "member" });
                    _dirty = true;
                }
                return Results.Json(new { id = t.Id });
            }
        });

        app.MapPost("/api/teams/{id}/projects", async (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            var name = Str(await Body(ctx), "name");
            if (name.Length is 0 or > 120) return Fail(400, "Укажите название проекта (до 120 символов)");
            var project = new ProjectRef { Id = NewId(14), By = u.Id, Created = DateTime.UtcNow };
            lock (_gate)
            {
                var t = _db.Teams.Find(x => x.Id == id);
                if (t == null || Role(t, u.Id) == null) return Fail(404, "Команда не найдена");
                if (t.Projects.Count >= 500) return Fail(400, "В команде слишком много проектов");
                t.Projects.Add(project);
                _dirty = true;
            }
            _hub.Rename(project.Id, name);
            return Results.Json(new { id = project.Id });
        });

        app.MapGet("/api/projects/{id}", (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            Team t;
            lock (_gate) t = TeamOf(id, u.Id);
            if (t == null) return Fail(404, "Проект не найден или у вас нет к нему доступа");
            return Results.Json(new { id, name = _hub.Describe(id).Name, teamId = t.Id, teamName = t.Name });
        });

        app.MapDelete("/api/projects/{id}", (HttpContext ctx, string id) =>
        {
            var u = Auth(ctx);
            if (u == null) return Fail(401, "Требуется вход");
            lock (_gate)
            {
                var t = TeamOf(id, u.Id);
                if (t == null) return Fail(404, "Проект не найден");
                var p = t.Projects.Find(x => x.Id == id);
                if (Role(t, u.Id) != "owner" && p.By != u.Id) return Fail(403, "Удалить проект может его автор или владелец команды");
                t.Projects.Remove(p);
                _dirty = true;
            }
            _hub.Delete(id);
            return Results.Ok();
        });
    }
}
