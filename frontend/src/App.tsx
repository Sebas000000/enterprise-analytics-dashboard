import React, { useEffect, useState, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { MetricCards } from './components/MetricCards';
import { TableToolbar } from './components/TableToolbar';
import { TransactionTable } from './components/TransactionTable';
import { TablePagination } from './components/TablePagination';
import { StatusBar } from './components/StatusBar';
import { fetchAnalyticsSummary, fetchTransactions, downloadTransactionsCsv } from './services/api';
import type { AnalyticsSummary, Transaction, TransactionFilters } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  // State for metrics and summary
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);

  // State for transactions table
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter and pagination state
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('CreatedAt');
  const [sortDescending, setSortDescending] = useState<boolean>(true);

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // UI state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load KPI analytics summary
  const loadSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      const data = await fetchAnalyticsSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching analytics summary:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  // Load transactions data
  const loadTransactions = useCallback(async () => {
    try {
      setIsTransactionsLoading(true);
      setErrorMessage(null);

      const filters: TransactionFilters = {
        pageNumber,
        pageSize,
        status: activeTab !== 'All' ? activeTab : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        searchTerm: searchTerm.trim() !== '' ? searchTerm.trim() : undefined,
        sortBy,
        sortDescending,
      };

      const result = await fetchTransactions(filters);
      setTransactions(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend API';
      setErrorMessage(msg);
      console.error('Error fetching transactions:', err);
    } finally {
      setIsTransactionsLoading(false);
    }
  }, [pageNumber, pageSize, activeTab, selectedCategory, searchTerm, sortBy, sortDescending]);

  // Initial load
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Debounced search / filter reload
  useEffect(() => {
    const handler = setTimeout(() => {
      loadTransactions();
    }, 150);

    return () => clearTimeout(handler);
  }, [loadTransactions]);

  // Handle CSV export
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const filters: TransactionFilters = {
        pageNumber: 1,
        pageSize: 10000,
        status: activeTab !== 'All' ? activeTab : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        searchTerm: searchTerm.trim() !== '' ? searchTerm.trim() : undefined,
        sortBy,
        sortDescending,
      };
      await downloadTransactionsCsv(filters);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Error triggering CSV download. Please check backend connection.');
    } finally {
      setIsExporting(false);
    }
  };

  // Sorting handler
  const handleSortChange = (column: string) => {
    if (sortBy.toLowerCase() === column.toLowerCase()) {
      setSortDescending(!sortDescending);
    } else {
      setSortBy(column);
      setSortDescending(true);
    }
    setPageNumber(1);
  };

  // Tab change handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPageNumber(1);
  };

  // Selection handlers
  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(transactions.map((t) => t.id));
      setSelectedIds(newSet);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <TopNav onExportCsv={handleExportCsv} isExporting={isExporting} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Enterprise Transactions Ledger</span>
              <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
                v2.8
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Real-time settlement stream, high-throughput pipelines, and compliance verification audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadSummary();
                loadTransactions();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111113] hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 rounded-md text-xs text-zinc-300 transition-colors active:scale-[0.98]"
              title="Refresh ledger data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTransactionsLoading ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error notification if backend connection fails */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-rose-950/30 border border-rose-800/50 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}. Ensure the .NET backend is running on http://localhost:5000.</span>
            </div>
            <button
              onClick={() => loadTransactions()}
              className="px-2.5 py-1 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 rounded text-rose-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 KPI Metric Cards */}
        <MetricCards summary={summary} isLoading={isSummaryLoading} />

        {/* Table Control Toolbar */}
        <TableToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPageNumber(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setPageNumber(1);
          }}
          totalCount={totalCount}
        />

        {/* Transaction Table */}
        <TransactionTable
          data={transactions}
          isLoading={isTransactionsLoading}
          sortBy={sortBy}
          sortDescending={sortDescending}
          onSortChange={handleSortChange}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectRow={handleToggleSelectRow}
        />

        {/* Table Pagination */}
        <TablePagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={(p) => setPageNumber(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageNumber(1);
          }}
        />
      </main>

      {/* Fixed Bottom Operational Status Bar */}
      <StatusBar />
    </div>
  );
};

export default App;
