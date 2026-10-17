using EnterpriseAnalytics.Application.Interfaces;
using EnterpriseAnalytics.Infrastructure.Persistence;
using EnterpriseAnalytics.Infrastructure.Persistence.Seed;
using EnterpriseAnalytics.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EnterpriseAnalytics.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=enterprise_analytics;Username=postgres;Password=postgres";

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorCodesToAdd: null);
            });
        });

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<DatabaseSeeder>();
        services.AddScoped<ICsvExportService, CsvExportService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        return services;
    }
}
