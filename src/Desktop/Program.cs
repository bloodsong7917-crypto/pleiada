using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace Pleiada;

static class Program
{
    [STAThread]
    static void Main()
    {
        using var mutex = new Mutex(true, "Pleiada.SingleInstance", out var first);
        if (!first)
        {
            MessageBox.Show("Плеяда уже запущена.", "Плеяда", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }

        ApplicationConfiguration.Initialize();

        var dataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Pleiada");
        using var hub = new BoardHub(Path.Combine(dataDir, "boards"), Environment.GetEnvironmentVariable("PLEIADA_WWW"));

        // Порт фиксированный, чтобы настройки интерфейса (тема, список проектов) не терялись между запусками.
        WebApplication local = null;
        string url = null;
        for (var port = 47821; port < 47841 && local == null; port++)
        {
            url = $"http://127.0.0.1:{port}";
            var app = hub.CreateApp(new[] { url }, admin: true);
            try { app.Start(); local = app; }
            catch (IOException) { app.DisposeAsync().AsTask().Wait(); }
        }
        if (local == null)
        {
            MessageBox.Show("Не удалось запустить локальный сервер: все порты 47821–47840 заняты.", "Плеяда", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }

        Application.Run(new MainForm(hub, url, dataDir));
        local.StopAsync().Wait(2000);
    }
}
