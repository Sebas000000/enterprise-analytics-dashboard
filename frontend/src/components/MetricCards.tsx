import React from 'react';
import type { AnalyticsSummary } from '../types';
import { ArrowUpRight, Activity, Layers, DollarSign, CheckCircle2 } from 'lucide-react';

interface MetricCardsProps {
  summary: AnalyticsSummary | null;
  isLoading: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, isLoading }) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#111113] border border-zinc-800/70 rounded-lg p-4 animate-pulse h-28 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-zinc-800 rounded" />
              <div className="h-5 w-12 bg-zinc-800/80 rounded-full" />
            </div>
            <div className="h-7 w-32 bg-zinc-800 rounded mt-2" />
            <div className="h-2.5 w-40 bg-zinc-800/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Revenue */}
      <div className="bg-[#111113] border border-zinc-800/70 hover:border-zinc-700/80 rounded-lg p-4 transition-all duration-200 relative group overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Revenue</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {summary.revenue.formattedGrowth}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-white">
              {summary.revenue.formattedTotal}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              vs. previous period (+12.4%)
            </div>
          </div>

          {/* SVG Mini-Sparkline Ascendente */}
          <div className="w-20 h-9 shrink-0">
            <svg viewBox="0 0 80 36" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 30 Q 15 26, 25 22 T 45 16 T 65 10 T 80 4 L 80 36 L 0 36 Z"
                fill="url(#revenueGrad)"
              />
              <path
                d="M 0 30 Q 15 26, 25 22 T 45 16 T 65 10 T 80 4"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="80" cy="4" r="2.5" fill="#34d399" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Processed Volume */}
      <div className="bg-[#111113] border border-zinc-800/70 hover:border-zinc-700/80 rounded-lg p-4 transition-all duration-200 relative group overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Processed Volume</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/70 border border-zinc-700/60 px-1.5 py-0.5 rounded-full">
            30d window
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-white">
              {summary.volume.formattedVolume}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {summary.volume.formattedAvg} transactions
            </div>
          </div>

          {/* SVG Mini-Sparkline Fluctuante */}
          <div className="w-20 h-9 shrink-0">
            <svg viewBox="0 0 80 36" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 24 Q 15 12, 28 20 T 50 14 T 68 8 T 80 12 L 80 36 L 0 36 Z"
                fill="url(#volGrad)"
              />
              <path
                d="M 0 24 Q 15 12, 28 20 T 50 14 T 68 8 T 80 12"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="80" cy="12" r="2.5" fill="#60a5fa" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Active Pipelines */}
      <div className="bg-[#111113] border border-zinc-800/70 hover:border-zinc-700/80 rounded-lg p-4 transition-all duration-200 relative group overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Active Pipelines</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Active
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-white">
              {summary.pipelines.activePipelines} running
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              8 of 8 pipelines connected
            </div>
          </div>

          {/* Stepped Pipeline SVG */}
          <div className="w-20 h-9 shrink-0 flex items-end justify-between gap-1 pt-2">
            {[14, 20, 16, 26, 22, 28, 32, 34].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}px` }}
                className="w-1.5 rounded-t-sm bg-purple-500/70 hover:bg-purple-400 transition-colors"
                title={`Pipeline ${idx + 1}: Healthy`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. System Health */}
      <div className="bg-[#111113] border border-zinc-800/70 hover:border-zinc-700/80 rounded-lg p-4 transition-all duration-200 relative group overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>System Health</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
            Optimal
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-white">
              {summary.health.formattedHealth}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {summary.health.slaTarget}
            </div>
          </div>

          {/* Steady High-Uptime Health Line */}
          <div className="w-20 h-9 shrink-0">
            <svg viewBox="0 0 80 36" className="w-full h-full overflow-visible">
              <path
                d="M 0 10 L 25 10 L 32 6 L 38 14 L 44 10 L 80 10"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="80" cy="10" r="2.5" fill="#34d399" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
