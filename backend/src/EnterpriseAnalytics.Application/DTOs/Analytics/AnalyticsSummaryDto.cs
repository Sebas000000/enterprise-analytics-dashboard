namespace EnterpriseAnalytics.Application.DTOs.Analytics;

public class MetricSparklinePoint
{
    public string Timestamp { get; set; } = string.Empty;
    public decimal Value { get; set; }
}

public class RevenueMetricDto
{
    public decimal TotalRevenue { get; set; }
    public decimal RevenueGrowth { get; set; }
    public string FormattedTotal { get; set; } = string.Empty;
    public string FormattedGrowth { get; set; } = string.Empty;
    public IReadOnlyList<MetricSparklinePoint> Sparkline { get; set; } = Array.Empty<MetricSparklinePoint>();
}

public class VolumeMetricDto
{
    public int ProcessedVolume { get; set; }
    public decimal AvgPerDay { get; set; }
    public string FormattedVolume { get; set; } = string.Empty;
    public string FormattedAvg { get; set; } = string.Empty;
    public IReadOnlyList<MetricSparklinePoint> Sparkline { get; set; } = Array.Empty<MetricSparklinePoint>();
}

public class PipelineMetricDto
{
    public int ActivePipelines { get; set; }
    public int TotalPipelines { get; set; }
    public string StatusText { get; set; } = string.Empty;
    public IReadOnlyList<string> PipelineNames { get; set; } = Array.Empty<string>();
}

public class SystemHealthMetricDto
{
    public decimal SystemHealth { get; set; }
    public string SlaTarget { get; set; } = string.Empty;
    public string FormattedHealth { get; set; } = string.Empty;
    public string Status { get; set; } = "Operational";
}

public class AnalyticsSummaryDto
{
    public RevenueMetricDto Revenue { get; set; } = new();
    public VolumeMetricDto Volume { get; set; } = new();
    public PipelineMetricDto Pipelines { get; set; } = new();
    public SystemHealthMetricDto Health { get; set; } = new();

    // Convenience top-level properties
    public decimal TotalRevenue => Revenue.TotalRevenue;
    public decimal RevenueGrowth => Revenue.RevenueGrowth;
    public int ProcessedVolume => Volume.ProcessedVolume;
    public decimal AvgPerDay => Volume.AvgPerDay;
    public int ActivePipelines => Pipelines.ActivePipelines;
    public int TotalPipelines => Pipelines.TotalPipelines;
    public decimal SystemHealth => Health.SystemHealth;
    public string SlaTarget => Health.SlaTarget;
}
