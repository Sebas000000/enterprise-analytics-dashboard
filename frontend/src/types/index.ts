export type TransactionStatus = 'Settled' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  customerName: string;
  customerAccountId: string;
  amount: number;
  status: TransactionStatus;
  category: string;
  paymentMethod: string;
  pipeline: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionFilters {
  pageNumber: number;
  pageSize: number;
  status?: string;
  category?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface MetricSparklinePoint {
  timestamp: string;
  value: number;
}

export interface RevenueMetric {
  totalRevenue: number;
  revenueGrowth: number;
  formattedTotal: string;
  formattedGrowth: string;
  sparkline: MetricSparklinePoint[];
}

export interface VolumeMetric {
  processedVolume: number;
  avgPerDay: number;
  formattedVolume: string;
  formattedAvg: string;
  sparkline: MetricSparklinePoint[];
}

export interface PipelineMetric {
  activePipelines: number;
  totalPipelines: number;
  statusText: string;
  pipelineNames: string[];
}

export interface SystemHealthMetric {
  systemHealth: number;
  slaTarget: string;
  formattedHealth: string;
  status: string;
}

export interface AnalyticsSummary {
  revenue: RevenueMetric;
  volume: VolumeMetric;
  pipelines: PipelineMetric;
  health: SystemHealthMetric;
  totalRevenue: number;
  revenueGrowth: number;
  processedVolume: number;
  avgPerDay: number;
  activePipelines: number;
  totalPipelines: number;
  systemHealth: number;
  slaTarget: string;
}
