# Сборка из корня репозитория:  docker build -f src/Server/Dockerfile -t pleiada-server .
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/ ./src/
RUN dotnet publish src/Server/Pleiada.Server.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .
ENV PORT=8787 PLEIADA_DATA=/data
VOLUME /data
EXPOSE 8787
ENTRYPOINT ["dotnet", "Pleiada.Server.dll"]
