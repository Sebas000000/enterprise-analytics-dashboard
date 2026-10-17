import React, { useState } from 'react';
import { ChevronDown, Download, Search, FileSpreadsheet } from 'lucide-react';

interface TopNavProps {
  onExportCsv: () => void;
  isExporting?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onExportCsv, isExporting }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/70">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Workspace Breadcrumb & Production Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <button className="flex items-center gap-1 hover:text-zinc-200 transition-colors">
              <span className="text-zinc-300 font-semibold">Workspace</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-100 font-medium tracking-tight">Enterprise Transactions</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>Production</span>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden md:flex flex-1 max-w-md items-center">
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-hover:text-zinc-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              readOnly
              placeholder="Search or jump to... ⌘K"
              className="w-full pl-9 pr-12 py-1.5 bg-[#111113] hover:bg-[#161619] border border-zinc-800/70 hover:border-zinc-700 rounded-md text-xs text-zinc-300 placeholder-zinc-500 cursor-pointer transition-all duration-150 focus:outline-none"
              onClick={() => {
                const searchInput = document.getElementById('table-search-input');
                if (searchInput) searchInput.focus();
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Status, Export Trigger & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Live Sync Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111113] border border-zinc-800/60 text-xs text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </span>
            <span className="font-mono text-[11px] text-zinc-300">Live sync</span>
          </div>

          {/* Export Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161619] hover:bg-zinc-800/80 active:scale-[0.98] border border-zinc-700/70 hover:border-zinc-600 rounded-md text-xs font-medium text-zinc-200 transition-all duration-150 shadow-sm disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-1.5 w-48 bg-[#111113] border border-zinc-800 rounded-md shadow-xl py-1 z-50 text-xs"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportCsv();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-zinc-200 hover:bg-zinc-800/50 hover:text-white transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download CSV (UTF-8)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-zinc-800/70">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-600 flex items-center justify-center text-xs font-semibold text-zinc-100 shadow-inner">
              AK
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
