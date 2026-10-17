using EnterpriseAnalytics.Application.DTOs.Analytics;
using EnterpriseAnalytics.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriseAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        IAnalyticsService analyticsService,
        ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves executive enterprise analytics summary including revenue growth, volume, pipeline status and SLA health.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Analytics summary DTO with high-precision KPI metrics and sparklines.</returns>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(AnalyticsSummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving analytics summary metrics");
        var summary = await _analyticsService.GetSummaryAsync(cancellationToken);
        return Ok(summary);
    }
}
