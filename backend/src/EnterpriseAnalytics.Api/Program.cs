using System.Reflection;
using System.Text.Json.Serialization;
using EnterpriseAnalytics.Api.Middleware;
using EnterpriseAnalytics.Infrastructure;
using EnterpriseAnalytics.Infrastructure.Persistence;
using EnterpriseAnalytics.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers with JSON formatting
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Configure CORS
const string corsPolicyName = "AllowFrontendClient";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host is "localhost" or "127.0.0.1")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Register Infrastructure Services
builder.Services.AddInfrastructureServices(builder.Configuration);

// Configure OpenAPI / Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Enterprise Analytics Dashboard API",
        Version = "v1",
        Description = "High-performance enterprise analytics and transactional stream backend designed for Claude Artifacts / Linear aesthetic dashboards. Built with .NET 8, Clean Architecture, and EF Core PostgreSQL.",
        Contact = new OpenApiContact
        {
            Name = "Platform Engineering Team",
            Email = "engineering@enterprise-analytics.internal"
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddHealthChecks();

var app = builder.Build();

// Migrate and Seed Database on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    var seeder = services.GetRequiredService<DatabaseSeeder>();

    try
    {
        logger.LogInformation("Applying database migrations or ensuring schema creation...");
        await dbContext.Database.EnsureCreatedAsync();

        logger.LogInformation("Seeding database with demo transaction records...");
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Could not automatically migrate or seed database on startup. Ensure PostgreSQL service is reachable.");
    }
}

// Global Exception Handler Middleware
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// Enable Swagger in all environments for testing ease
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Enterprise Analytics API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "Enterprise Analytics - API Docs";
});

app.UseCors(corsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
