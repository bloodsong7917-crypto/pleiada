using Pleiada;

// Облачный сервер «Плеяды»: раздаёт веб-версию и синхронизирует доски между участниками.
//   PORT          — порт (по умолчанию 8787)
//   PLEIADA_DATA  — папка с данными (по умолчанию ./data)
//   PLEIADA_WWW   — папка с веб-клиентом вместо встроенного (для разработки)

var port = Environment.GetEnvironmentVariable("PORT") ?? "8787";
var data = Environment.GetEnvironmentVariable("PLEIADA_DATA") ?? Path.Combine(Directory.GetCurrentDirectory(), "data");
var www = Environment.GetEnvironmentVariable("PLEIADA_WWW");
#if DEBUG
if (www == null)
{
    foreach (var candidate in new[] { "src/web", "../web" })
        if (File.Exists(Path.Combine(candidate, "index.html"))) { www = Path.GetFullPath(candidate); break; }
}
#endif

using var hub = new BoardHub(data, www);
var app = hub.CreateApp(new[] { $"http://0.0.0.0:{port}" }, admin: false, log: true);
Console.WriteLine($"Плеяда: сервер запущен на порту {port}, данные в {data}");
app.Run();
