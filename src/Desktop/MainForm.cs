using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace Pleiada;

sealed class MainForm : Form
{
    readonly BoardHub _hub;
    readonly string _url;
    readonly string _dataDir;
    readonly WebView2 _web = new() { Dock = DockStyle.Fill };
    WebApplication _lan;
    int _lanPort;

    public MainForm(BoardHub hub, string url, string dataDir)
    {
        _hub = hub;
        _url = url;
        _dataDir = dataDir;
        Text = "Плеяда";
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(1440, 900);
        MinimumSize = new Size(900, 600);
        BackColor = Color.FromArgb(0xF6, 0xF1, 0xE4);
        using (var s = typeof(MainForm).Assembly.GetManifestResourceStream("app.ico"))
            if (s != null) Icon = new Icon(s);
        Controls.Add(_web);
        Load += async (_, _) => await InitWeb();
        FormClosed += (_, _) => StopLan();
    }

    async Task InitWeb()
    {
        try
        {
            var env = await CoreWebView2Environment.CreateAsync(null, Path.Combine(_dataDir, "WebView2"));
            await _web.EnsureCoreWebView2Async(env);
        }
        catch (Exception ex)
        {
            MessageBox.Show(this,
                "Не удалось запустить Microsoft Edge WebView2 Runtime. Установите его с сайта Microsoft и перезапустите приложение.\n\n" + ex.Message,
                "Плеяда", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Close();
            return;
        }

        var core = _web.CoreWebView2;
        core.Settings.AreDefaultContextMenusEnabled = false;
        core.Settings.IsStatusBarEnabled = false;
        core.Settings.IsZoomControlEnabled = false;
        core.Settings.AreBrowserAcceleratorKeysEnabled = false;

        var host = JsonSerializer.Serialize(new { desktop = true, token = _hub.AdminToken, user = Environment.UserName });
        await core.AddScriptToExecuteOnDocumentCreatedAsync($"window.__host={host};");

        // Окно показывает только собственный интерфейс; всё внешнее уходит в браузер по умолчанию.
        core.NavigationStarting += (_, e) =>
        {
            if (e.Uri.StartsWith(_url + "/", StringComparison.OrdinalIgnoreCase)) return;
            e.Cancel = true;
            OpenExternal(e.Uri);
        };
        core.NewWindowRequested += (_, e) =>
        {
            e.Handled = true;
            OpenExternal(e.Uri);
        };
        core.WebMessageReceived += (_, e) => OnMessage(e.WebMessageAsJson);
        core.Navigate(_url + "/");
    }

    static void OpenExternal(string uri)
    {
        if (!Uri.TryCreate(uri, UriKind.Absolute, out var u) || (u.Scheme != "http" && u.Scheme != "https")) return;
        try { Process.Start(new ProcessStartInfo(u.AbsoluteUri) { UseShellExecute = true }); } catch { }
    }

    void OnMessage(string json)
    {
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        if (root.ValueKind != JsonValueKind.Object || !root.TryGetProperty("type", out var type)) return;
        switch (type.GetString())
        {
            case "theme":
                ApplyTheme(root.TryGetProperty("dark", out var d) && d.ValueKind == JsonValueKind.True);
                break;
            case "lan":
                if (root.TryGetProperty("on", out var on) && on.ValueKind == JsonValueKind.True) StartLan();
                else if (on.ValueKind == JsonValueKind.False) StopLan();
                ReportLan(null);
                break;
        }
    }

    // ---------- доступ из сети ----------

    void StartLan()
    {
        if (_lan != null) return;
        for (var port = 8787; port < 8797; port++)
        {
            var app = _hub.CreateApp(new[] { $"http://0.0.0.0:{port}" }, admin: false);
            try
            {
                Task.Run(() => app.Start()).GetAwaiter().GetResult();
                _lan = app;
                _lanPort = port;
                return;
            }
            catch (IOException) { app.DisposeAsync().AsTask().Wait(); }
        }
        ReportLan("Не удалось открыть порт 8787–8796");
    }

    void StopLan()
    {
        var app = _lan;
        _lan = null;
        if (app != null) Task.Run(async () => { await app.StopAsync(); await app.DisposeAsync(); });
    }

    void ReportLan(string error)
    {
        var urls = new List<string>();
        if (_lan != null)
        {
            foreach (var ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (ni.OperationalStatus != OperationalStatus.Up || ni.NetworkInterfaceType == NetworkInterfaceType.Loopback) continue;
                foreach (var a in ni.GetIPProperties().UnicastAddresses)
                    if (a.Address.AddressFamily == AddressFamily.InterNetwork)
                        urls.Add($"http://{a.Address}:{_lanPort}");
            }
        }
        _web.CoreWebView2?.PostWebMessageAsJson(JsonSerializer.Serialize(new { type = "lan", on = _lan != null, urls, error }));
    }

    // ---------- оформление окна ----------

    [DllImport("dwmapi.dll")]
    static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int value, int size);

    void ApplyTheme(bool dark)
    {
        var bg = dark ? Color.FromArgb(0x0C, 0x0A, 0x12) : Color.FromArgb(0xF6, 0xF1, 0xE4);
        BackColor = bg;
        _web.DefaultBackgroundColor = bg;
        var on = dark ? 1 : 0;
        DwmSetWindowAttribute(Handle, 20 /* DWMWA_USE_IMMERSIVE_DARK_MODE */, ref on, sizeof(int));
        // Цвет заголовка под цвет холста (Windows 11).
        var caption = bg.R | (bg.G << 8) | (bg.B << 16);
        DwmSetWindowAttribute(Handle, 35 /* DWMWA_CAPTION_COLOR */, ref caption, sizeof(int));
    }
}
