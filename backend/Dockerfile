# Multi-stage optimized Dockerfile for .NET 8 Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project definitions for layer caching
COPY EnterpriseAnalytics.sln ./
COPY src/EnterpriseAnalytics.Domain/EnterpriseAnalytics.Domain.csproj src/EnterpriseAnalytics.Domain/
COPY src/EnterpriseAnalytics.Application/EnterpriseAnalytics.Application.csproj src/EnterpriseAnalytics.Application/
COPY src/EnterpriseAnalytics.Infrastructure/EnterpriseAnalytics.Infrastructure.csproj src/EnterpriseAnalytics.Infrastructure/
COPY src/EnterpriseAnalytics.Api/EnterpriseAnalytics.Api.csproj src/EnterpriseAnalytics.Api/

# Restore dependencies
RUN dotnet restore "EnterpriseAnalytics.sln"

# Copy remaining source code and publish
COPY . .
WORKDIR /src/src/EnterpriseAnalytics.Api
RUN dotnet publish "EnterpriseAnalytics.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Non-root user execution & production configuration
USER app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EnterpriseAnalytics.Api.dll"]
