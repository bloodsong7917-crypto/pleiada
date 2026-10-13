@echo off
rem Starts the Pleiada web version at http://localhost:8787 (data is stored in the "data" folder next to this file).
cd /d "%~dp0"
start "" http://localhost:8787
dotnet dist\server\Pleiada.Server.dll
