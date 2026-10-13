using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Pleiada;

sealed class Peer
{
    public string Cid = "", Name = "", Color = "";
    public WebSocket Socket;
    public readonly SemaphoreSlim SendLock = new(1, 1);
}

sealed class Room
{
    public string Id = "";
    public string Name = "";
    public DateTime Updated = DateTime.UtcNow;
    public bool Dirty;
    public readonly Dictionary<string, JsonObject> Els = new();
    public readonly Dictionary<string, long> Tombs = new();
    public readonly List<Peer> Peers = new();
    public readonly object Gate = new();
}

/// <summary>
/// Хранилище досок и сервер совместной работы. Каждая доска — «комната»:
/// набор элементов, синхронизируемых по принципу last-writer-wins (версия + id клиента).
/// </summary>
public sealed class BoardHub : IDisposable
{
    const int MaxMessage = 8 * 1024 * 1024;
    const int MaxElement = 256 * 1024;
    const long MaxBlob = 64L * 1024 * 1024;

    static readonly Regex IdRx = new("^[A-Za-z0-9_-]{6,40}$", RegexOptions.Compiled);
    static readonly Regex BlobRx = new("^[a-f0-9]{24}(\\.[a-z0-9]{1,8})?$", RegexOptions.Compiled);
    static readonly JsonSerializerOptions Json = new() { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
    static readonly Dictionary<string, string> Mime = new()
    {
        [".html"] = "text/html; charset=utf-8", [".css"] = "text/css; charset=utf-8",
        [".js"] = "text/javascript; charset=utf-8", [".svg"] = "image/svg+xml", [".ico"] = "image/x-icon",
        [".png"] = "image/png", [".jpg"] = "image/jpeg", [".jpeg"] = "image/jpeg",
        [".gif"] = "image/gif", [".webp"] = "image/webp", [".pdf"] = "application/pdf",
    };
    static readonly HashSet<string> InlineBlobs = new() { ".png", ".jpg", ".jpeg", ".gif", ".webp" };

    readonly string _dir;
    readonly string _wwwDir;
    readonly ConcurrentDictionary<string, Room> _rooms = new();
    readonly System.Threading.Timer _saver;

    public string AdminToken { get; } = Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

    /// <summary>Если задано — доска и её файлы доступны только тем, кого пропустит проверка (учётные записи).</summary>
    public Func<HttpContext, string, bool> Authorize { get; set; }

    /// <summary>Имя участника из учётной записи вместо присланного клиентом.</summary>
    public Func<HttpContext, string> PeerName { get; set; }

    bool Allowed(HttpContext ctx, string room) => Authorize == null || Authorize(ctx, room);

    public (string Name, DateTime Updated, int Count) Describe(string id)
    {
        var r = GetRoom(id);
        lock (r.Gate) return (r.Name, r.Updated, r.Els.Count);
    }

    public void Rename(string id, string name)
    {
        var r = GetRoom(id);
        lock (r.Gate) { r.Name = Clip(name, 120); Touch(r); }
        Broadcast(r, null, $"{{\"t\":\"meta\",\"name\":{JsonSerializer.Serialize(r.Name, Json)}}}");
    }

    public void Delete(string id)
    {
        if (!IdRx.IsMatch(id)) return;
        if (_rooms.TryRemove(id, out var r))
        {
            Peer[] peers;
            lock (r.Gate) { peers = r.Peers.ToArray(); r.Dirty = false; }
            foreach (var p in peers) p.Socket.Abort();
        }
        if (Directory.Exists(RoomDir(id))) Directory.Delete(RoomDir(id), true);
    }

    public BoardHub(string dataDir, string wwwDir = null)
    {
        _dir = dataDir;
        _wwwDir = wwwDir;
        Directory.CreateDirectory(_dir);
        _saver = new System.Threading.Timer(_ => Flush(), null, 2000, 2000);
    }

    public void Dispose()
    {
        _saver.Dispose();
        Flush();
    }

    // ---------- storage ----------

    string RoomDir(string id) => Path.Combine(_dir, id);
    string RoomFile(string id) => Path.Combine(_dir, id, "board.json");

    Room GetRoom(string id) => _rooms.GetOrAdd(id, Load);

    Room Load(string id)
    {
        var r = new Room { Id = id };
        var file = RoomFile(id);
        if (!File.Exists(file)) return r;
        try
        {
            var doc = JsonNode.Parse(File.ReadAllText(file))!.AsObject();
            r.Name = (string)doc["name"] ?? "";
            if (DateTime.TryParse((string)doc["updated"], null, System.Globalization.DateTimeStyles.RoundtripKind, out var u)) r.Updated = u;
            foreach (var n in doc["els"]?.AsArray() ?? new JsonArray())
            {
                var el = n!.DeepClone().AsObject();
                r.Els[(string)el["id"]!] = el;
            }
            foreach (var kv in doc["tombs"]?.AsObject() ?? new JsonObject())
                r.Tombs[kv.Key] = Num(kv.Value);
        }
        catch (Exception ex)
        {
            // Повреждённый файл не затираем — откладываем копию.
            try { File.Copy(file, file + ".broken", true); } catch { }
            Console.Error.WriteLine($"Не удалось прочитать доску {id}: {ex.Message}");
        }
        return r;
    }

    public void Flush()
    {
        foreach (var r in _rooms.Values)
        {
            string text;
            lock (r.Gate)
            {
                if (!r.Dirty) continue;
                r.Dirty = false;
                var sb = new StringBuilder();
                sb.Append("{\"name\":").Append(JsonSerializer.Serialize(r.Name, Json));
                sb.Append(",\"updated\":\"").Append(r.Updated.ToString("o")).Append("\",\"els\":[");
                sb.AppendJoin(',', r.Els.Values.Select(e => e.ToJsonString(Json)));
                sb.Append("],\"tombs\":").Append(JsonSerializer.Serialize(r.Tombs, Json)).Append('}');
                text = sb.ToString();
            }
            try
            {
                Directory.CreateDirectory(RoomDir(r.Id));
                var tmp = RoomFile(r.Id) + ".tmp";
                File.WriteAllText(tmp, text);
                File.Move(tmp, RoomFile(r.Id), true);
            }
            catch (Exception ex)
            {
                lock (r.Gate) r.Dirty = true;
                Console.Error.WriteLine($"Не удалось сохранить доску {r.Id}: {ex.Message}");
            }
        }
    }

    static long Num(JsonNode n) => n == null ? 0 : (long)n.GetValue<double>();

    static void Touch(Room r)
    {
        r.Dirty = true;
        r.Updated = DateTime.UtcNow;
    }

    // ---------- sync ----------

    static bool ApplySet(Room r, JsonObject el)
    {
        if (el["id"] is not JsonValue idv || !idv.TryGetValue<string>(out var id) || id.Length is 0 or > 64) return false;
        var v = Num(el["v"]);
        var by = (string)el["by"] ?? "";
        if (r.Tombs.TryGetValue(id, out var tv) && tv >= v) return false;
        if (r.Els.TryGetValue(id, out var cur))
        {
            var cv = Num(cur["v"]);
            if (v < cv || (v == cv && string.CompareOrdinal(by, (string)cur["by"] ?? "") <= 0)) return false;
        }
        r.Els[id] = el;
        r.Tombs.Remove(id);
        return true;
    }

    void Handle(Room r, Peer peer, string text)
    {
        var msg = JsonNode.Parse(text) as JsonObject;
        if (msg == null) return;
        var from = JsonSerializer.Serialize(peer.Cid);
        switch ((string)msg["t"])
        {
            case "set":
            {
                var accepted = new List<string>();
                lock (r.Gate)
                {
                    foreach (var n in msg["els"]?.AsArray() ?? new JsonArray())
                    {
                        if (n is not JsonObject src) continue;
                        var raw = src.ToJsonString(Json);
                        if (raw.Length > MaxElement) continue;
                        if (ApplySet(r, src.DeepClone().AsObject())) accepted.Add(raw);
                    }
                    if (accepted.Count > 0) Touch(r);
                }
                if (accepted.Count > 0)
                    Broadcast(r, peer, $"{{\"t\":\"set\",\"from\":{from},\"els\":[{string.Join(',', accepted)}]}}");
                break;
            }
            case "del":
            {
                var accepted = new List<string>();
                lock (r.Gate)
                {
                    foreach (var n in msg["ids"]?.AsArray() ?? new JsonArray())
                    {
                        if (n is not JsonArray pair || pair.Count < 2) continue;
                        var id = (string)pair[0];
                        var v = Num(pair[1]);
                        if (string.IsNullOrEmpty(id) || id.Length > 64) continue;
                        if (r.Els.TryGetValue(id, out var cur) && Num(cur["v"]) > v) continue;
                        r.Els.Remove(id);
                        r.Tombs[id] = Math.Max(v, r.Tombs.GetValueOrDefault(id));
                        accepted.Add($"[{JsonSerializer.Serialize(id)},{v}]");
                    }
                    if (accepted.Count > 0) Touch(r);
                }
                if (accepted.Count > 0)
                    Broadcast(r, peer, $"{{\"t\":\"del\",\"from\":{from},\"ids\":[{string.Join(',', accepted)}]}}");
                break;
            }
            case "cur":
                msg["from"] = peer.Cid;
                Broadcast(r, peer, msg.ToJsonString(Json));
                break;
            case "meta":
            {
                var name = Clip((string)msg["name"], 120);
                lock (r.Gate) { r.Name = name; Touch(r); }
                Broadcast(r, peer, $"{{\"t\":\"meta\",\"name\":{JsonSerializer.Serialize(name, Json)}}}");
                break;
            }
            case "who":
                if (PeerName != null) break;
                peer.Name = Clip((string)msg["name"], 40);
                Broadcast(r, peer, $"{{\"t\":\"join\",\"peer\":{PeerJson(peer)}}}");
                break;
        }
    }

    static string Clip(string s, int max)
    {
        s = (s ?? "").Trim();
        return s.Length > max ? s[..max] : s;
    }

    static string PeerJson(Peer p) =>
        new JsonObject { ["cid"] = p.Cid, ["name"] = p.Name, ["color"] = p.Color }.ToJsonString(Json);

    void Broadcast(Room r, Peer except, string json)
    {
        Peer[] targets;
        lock (r.Gate) targets = r.Peers.Where(p => p != except).ToArray();
        if (targets.Length == 0) return;
        var bytes = Encoding.UTF8.GetBytes(json);
        foreach (var p in targets) _ = Send(p, bytes);
    }

    static async Task Send(Peer p, byte[] bytes)
    {
        try
        {
            await p.SendLock.WaitAsync();
            try
            {
                if (p.Socket.State == WebSocketState.Open)
                    await p.Socket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
            }
            finally { p.SendLock.Release(); }
        }
        catch { }
    }

    async Task RunPeer(HttpContext ctx, string roomId)
    {
        using var ws = await ctx.WebSockets.AcceptWebSocketAsync();
        var q = ctx.Request.Query;
        var peer = new Peer
        {
            Socket = ws,
            Cid = Clip(q["cid"], 24),
            Name = Clip(PeerName != null ? PeerName(ctx) : (string)q["name"], 40),
            Color = Clip(q["color"], 16),
        };
        if (peer.Cid.Length == 0) peer.Cid = Convert.ToHexString(RandomNumberGenerator.GetBytes(4));

        var r = GetRoom(roomId);
        string init;
        lock (r.Gate)
        {
            var sb = new StringBuilder("{\"t\":\"init\",\"name\":");
            sb.Append(JsonSerializer.Serialize(r.Name, Json)).Append(",\"peers\":[");
            sb.AppendJoin(',', r.Peers.Select(PeerJson));
            sb.Append("],\"els\":[");
            sb.AppendJoin(',', r.Els.Values.Select(e => e.ToJsonString(Json)));
            sb.Append("]}");
            init = sb.ToString();
            r.Peers.Add(peer);
        }
        await Send(peer, Encoding.UTF8.GetBytes(init));
        Broadcast(r, peer, $"{{\"t\":\"join\",\"peer\":{PeerJson(peer)}}}");

        var buf = new byte[16 * 1024];
        var ms = new MemoryStream();
        try
        {
            while (ws.State == WebSocketState.Open)
            {
                var res = await ws.ReceiveAsync(buf, ctx.RequestAborted);
                if (res.MessageType == WebSocketMessageType.Close) break;
                ms.Write(buf, 0, res.Count);
                if (ms.Length > MaxMessage) break;
                if (!res.EndOfMessage) continue;
                var text = Encoding.UTF8.GetString(ms.GetBuffer(), 0, (int)ms.Length);
                ms.SetLength(0);
                try { Handle(r, peer, text); } catch (Exception ex) when (ex is JsonException or InvalidOperationException or FormatException) { }
            }
        }
        catch (Exception ex) when (ex is WebSocketException or OperationCanceledException or IOException) { }
        finally
        {
            lock (r.Gate) r.Peers.Remove(peer);
            Broadcast(r, null, $"{{\"t\":\"leave\",\"cid\":{JsonSerializer.Serialize(peer.Cid)}}}");
        }
    }

    // ---------- http ----------

    async Task Asset(HttpContext ctx, string file)
    {
        var ext = Path.GetExtension(file).ToLowerInvariant();
        if (file.Contains("..") || file.Contains('/') || file.Contains('\\') || !Mime.TryGetValue(ext, out var mime))
        {
            ctx.Response.StatusCode = 404;
            return;
        }
        Stream s = null;
        if (_wwwDir != null)
        {
            var path = Path.Combine(_wwwDir, file);
            if (File.Exists(path)) s = File.OpenRead(path);
        }
        s ??= Assembly.GetEntryAssembly()!.GetManifestResourceStream("www/" + file);
        if (s == null) { ctx.Response.StatusCode = 404; return; }
        await using (s)
        {
            ctx.Response.ContentType = mime;
            ctx.Response.Headers.CacheControl = "no-cache";
            await s.CopyToAsync(ctx.Response.Body);
        }
    }

    /// <param name="admin">Разрешить список/удаление досок (только с AdminToken). Включается лишь для локального окна приложения.</param>
    public WebApplication CreateApp(string[] urls, bool admin, bool log = false)
    {
        var b = WebApplication.CreateSlimBuilder();
        b.WebHost.UseUrls(urls);
        b.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = MaxBlob);
        if (!log) b.Logging.ClearProviders();
        var app = b.Build();
        app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(25) });

        app.Use(async (ctx, next) =>
        {
            var h = ctx.Response.Headers;
            h["Access-Control-Allow-Origin"] = "*";
            h["X-Content-Type-Options"] = "nosniff";
            if (ctx.Request.Method == "OPTIONS")
            {
                h["Access-Control-Allow-Methods"] = "GET, POST, DELETE";
                h["Access-Control-Allow-Headers"] = "*";
                ctx.Response.StatusCode = 204;
                return;
            }
            await next();
        });

        bool IsAdmin(HttpContext ctx) => admin && ctx.Request.Headers["X-Admin"] == AdminToken;

        app.MapGet("/", ctx => Asset(ctx, "index.html"));
        app.MapGet("/{file}", (HttpContext ctx, string file) => Asset(ctx, file));

        app.MapGet("/api/info", () => Results.Json(new { app = "pleiada", version = 1, accounts = Authorize != null }));

        app.MapGet("/api/boards", (HttpContext ctx) =>
        {
            if (!IsAdmin(ctx)) return Results.StatusCode(403);
            // Сохранённые на диске плюс только что созданные, ещё не записанные.
            var ids = new HashSet<string>(_rooms.Where(kv => kv.Value.Dirty).Select(kv => kv.Key));
            foreach (var dir in Directory.EnumerateDirectories(_dir))
            {
                var id = Path.GetFileName(dir);
                if (IdRx.IsMatch(id) && File.Exists(RoomFile(id))) ids.Add(id);
            }
            var list = new List<object>();
            foreach (var id in ids)
            {
                var r = GetRoom(id);
                lock (r.Gate) list.Add(new { id, name = r.Name, updated = r.Updated, count = r.Els.Count });
            }
            return Results.Json(list);
        });

        app.MapDelete("/api/boards/{room}", (HttpContext ctx, string room) =>
        {
            if (!IsAdmin(ctx)) return Results.StatusCode(403);
            if (!IdRx.IsMatch(room)) return Results.BadRequest();
            Delete(room);
            return Results.Ok();
        });

        app.MapPost("/api/blob/{room}", async (HttpContext ctx, string room) =>
        {
            if (!IdRx.IsMatch(room)) return Results.BadRequest();
            if (!Allowed(ctx, room)) return Results.StatusCode(403);
            if (ctx.Request.ContentLength > MaxBlob) return Results.StatusCode(413);
            var ext = Path.GetExtension((string)ctx.Request.Query["name"] ?? "").ToLowerInvariant();
            if (!Regex.IsMatch(ext, "^\\.[a-z0-9]{1,8}$")) ext = "";
            var dir = Path.Combine(RoomDir(room), "blobs");
            Directory.CreateDirectory(dir);
            var tmp = Path.Combine(dir, Guid.NewGuid().ToString("N") + ".part");
            string hash;
            try
            {
                using var sha = SHA256.Create();
                await using (var fs = File.Create(tmp))
                await using (var cs = new CryptoStream(fs, sha, CryptoStreamMode.Write))
                    await ctx.Request.Body.CopyToAsync(cs);
                hash = Convert.ToHexString(sha.Hash!).ToLowerInvariant()[..24];
                File.Move(tmp, Path.Combine(dir, hash + ext), true);
            }
            finally
            {
                if (File.Exists(tmp)) File.Delete(tmp);
            }
            return Results.Json(new { url = $"/blob/{room}/{hash}{ext}" });
        });

        app.MapGet("/blob/{room}/{file}", (HttpContext ctx, string room, string file) =>
        {
            if (!IdRx.IsMatch(room) || !BlobRx.IsMatch(file)) return Results.NotFound();
            if (!Allowed(ctx, room)) return Results.StatusCode(403);
            var path = Path.Combine(RoomDir(room), "blobs", file);
            if (!File.Exists(path)) return Results.NotFound();
            var ext = Path.GetExtension(file);
            ctx.Response.Headers.CacheControl = (Authorize == null ? "public" : "private") + ", max-age=31536000, immutable";
            var mime = Mime.GetValueOrDefault(ext, "application/octet-stream");
            // Всё, кроме растровых картинок, отдаём только как вложение — чужой HTML/SVG не должен исполняться в нашем origin.
            if (InlineBlobs.Contains(ext)) return Results.File(path, mime);
            var name = (string)ctx.Request.Query["name"];
            return Results.File(path, mime, string.IsNullOrWhiteSpace(name) ? file : name);
        });

        app.Map("/ws/{room}", async (HttpContext ctx, string room) =>
        {
            if (!ctx.WebSockets.IsWebSocketRequest || !IdRx.IsMatch(room))
            {
                ctx.Response.StatusCode = 400;
                return;
            }
            if (!Allowed(ctx, room))
            {
                ctx.Response.StatusCode = 403;
                return;
            }
            await RunPeer(ctx, room);
        });

        return app;
    }
}
