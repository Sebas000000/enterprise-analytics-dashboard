using EnterpriseAnalytics.Application.DTOs.Analytics;

namespace EnterpriseAnalytics.Application.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
}
