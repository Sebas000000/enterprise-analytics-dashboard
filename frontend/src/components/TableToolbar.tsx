import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown, Filter, SlidersHorizontal, Calendar, X } from 'lucide-react';

interface TableToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalCount: number;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 days');

  // Register '/' shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs = [
    { id: 'All', label: 'All', count: totalCount > 0 ? totalCount.toLocaleString() : '1,420' },
    { id: 'Settled', label: 'Settled' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Failed', label: 'Failed' },
  ];

  const categories = ['All', 'Subscription', 'Invoice', 'Usage'];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Left: Segmented Pill Tabs */}
      <div className="flex items-center p-1 bg-[#111113] border border-zinc-800/70 rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-800/80 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right: Quick Search & Filter Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search input with '/' trigger */}
        <div className="relative flex-1 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            id="table-search-input"
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter transactions..."
            className="w-full pl-8 pr-8 py-1.5 bg-[#111113] border border-zinc-800/80 focus:border-zinc-600 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
          />
          {searchTerm ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="px-1 py-0.5 text-[9px] font-mono text-zinc-500 bg-zinc-800/70 border border-zinc-700/50 rounded">
                /
              </kbd>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateMenu(!showDateMenu);
              setShowCategoryMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111113] hover:bg-zinc-800/50 border border-zinc-800/80 rounded-md text-xs text-zinc-300 transition-colors active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showDateMenu && (
            <div
              className="absolute right-0 mt-1.5 w-40 bg-[#111113] border border-zinc-800 rounded-md shadow-xl py-1 z-40 text-xs"
              onMouseLeave={() => setShowDateMenu(false)}
            >
              {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'All time'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDateRange(item);
                    setShowDateMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors ${
                    dateRange === item ? 'text-emerald-400 font-medium' : 'text-zinc-300'
                  }`}
                >
                  <span>{item}</span>
                  {dateRange === item && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowDateMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111113] hover:bg-zinc-800/50 border border-zinc-800/80 rounded-md text-xs text-zinc-300 transition-colors active:scale-[0.98]"
          >
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>{selectedCategory === 'All' ? 'Category' : selectedCategory}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showCategoryMenu && (
            <div
              className="absolute right-0 mt-1.5 w-40 bg-[#111113] border border-zinc-800 rounded-md shadow-xl py-1 z-40 text-xs"
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors ${
                    selectedCategory === cat ? 'text-emerald-400 font-medium' : 'text-zinc-300'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columns Trigger */}
        <button
          onClick={() => {}}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#111113] hover:bg-zinc-800/50 border border-zinc-800/80 rounded-md text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Toggle columns"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Columns</span>
        </button>
      </div>
    </div>
  );
};
