# Сборка «Плеяды».  Запуск:  powershell -ExecutionPolicy Bypass -File build.ps1
# Результат:
#   dist\Pleiada.exe            — настольное приложение (один файл, .NET внутри)
#   dist\server\                — облачный сервер (нужен .NET 10 Runtime: dotnet Pleiada.Server.dll)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

dotnet publish src/Desktop/Pleiada.csproj -c Release -r win-x64 --self-contained true `
    -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true `
    -p:EnableCompressionInSingleFile=true -p:DebugType=none -o dist --nologo
if ($LASTEXITCODE) { throw 'Не удалось собрать приложение' }

dotnet publish src/Server/Pleiada.Server.csproj -c Release -p:DebugType=none -o dist/server --nologo
if ($LASTEXITCODE) { throw 'Не удалось собрать сервер' }

Write-Host "`nГотово: dist\Pleiada.exe и dist\server\" -ForegroundColor Green

Remove-Item dist\*.xml -ErrorAction SilentlyContinue
