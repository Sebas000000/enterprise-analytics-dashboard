import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const fromRecord = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const toRecord = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 text-xs text-zinc-400">
      {/* Left: Rows Per Page Selector */}
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-[#111113] border border-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-zinc-700 cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={12}>12</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-zinc-600">|</span>
        <span className="font-mono text-zinc-400">
          Showing <span className="text-zinc-200 font-medium">{fromRecord}</span>-
          <span className="text-zinc-200 font-medium">{toRecord}</span> of{' '}
          <span className="text-zinc-200 font-medium">{totalCount.toLocaleString()}</span> items
        </span>
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-zinc-400 mr-2">
          Page <span className="text-zinc-200 font-medium">{pageNumber}</span> of{' '}
          <span className="text-zinc-200 font-medium">{Math.max(1, totalPages)}</span>
        </span>

        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={pageNumber <= 1}
          title="First page"
          className="p-1.5 rounded-md bg-[#111113] border border-zinc-800 hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          title="Previous page"
          className="p-1.5 rounded-md bg-[#111113] border border-zinc-800 hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Next page */}
        <button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          title="Next page"
          className="p-1.5 rounded-md bg-[#111113] border border-zinc-800 hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={pageNumber >= totalPages}
          title="Last page"
          className="p-1.5 rounded-md bg-[#111113] border border-zinc-800 hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
