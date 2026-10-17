import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Transaction, TransactionStatus } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Copy } from 'lucide-react';

interface TransactionTableProps {
  data: Transaction[];
  isLoading: boolean;
  sortBy?: string;
  sortDescending?: boolean;
  onSortChange: (column: string) => void;
  selectedIds: Set<string>;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectRow: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading,
  sortBy,
  sortDescending,
  onSortChange,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
}) => {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(row.id));
  const someSelected = data.some((row) => selectedIds.has(row.id)) && !allSelected;

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      // Checkbox column
      {
        id: 'select',
        header: () => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={(e) => onToggleSelectAll(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.has(row.original.id)}
              onChange={() => onToggleSelectRow(row.original.id)}
              className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
          </div>
        ),
      },
      // Transaction ID (mono)
      {
        accessorKey: 'id',
        header: 'Transaction ID',
        cell: ({ row }) => {
          const val = row.original.id;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 hover:text-white transition-colors group">
              <span>{val}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(val);
                }}
                title="Copy Transaction ID"
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          );
        },
      },
      // Customer
      {
        accessorKey: 'customerName',
        header: () => (
          <button
            onClick={() => onSortChange('CustomerName')}
            className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
          >
            <span>Customer</span>
            {sortBy?.toLowerCase() === 'customername' ? (
              sortDescending ? (
                <ArrowDown className="w-3 h-3 text-emerald-400" />
              ) : (
                <ArrowUp className="w-3 h-3 text-emerald-400" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-zinc-600 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="text-xs font-medium text-zinc-100">{row.original.customerName}</div>
            <div className="text-[11px] font-mono text-zinc-500">{row.original.customerAccountId}</div>
          </div>
        ),
      },
      // Amount (USD, Right aligned, mono)
      {
        accessorKey: 'amount',
        header: () => (
          <div className="flex justify-end">
            <button
              onClick={() => onSortChange('Amount')}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
            >
              <span>Amount (USD)</span>
              {sortBy?.toLowerCase() === 'amount' ? (
                sortDescending ? (
                  <ArrowDown className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowUp className="w-3 h-3 text-emerald-400" />
                )
              ) : (
                <ArrowUpDown className="w-3 h-3 text-zinc-600 opacity-60" />
              )}
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(row.original.amount);

          return (
            <div className="text-right font-mono text-xs font-semibold text-zinc-100">
              {formatted}
            </div>
          );
        },
      },
      // Status (Pill with glowing dot)
      {
        accessorKey: 'status',
        header: () => (
          <button
            onClick={() => onSortChange('Status')}
            className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
          >
            <span>Status</span>
            {sortBy?.toLowerCase() === 'status' ? (
              sortDescending ? (
                <ArrowDown className="w-3 h-3 text-emerald-400" />
              ) : (
                <ArrowUp className="w-3 h-3 text-emerald-400" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-zinc-600 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const status = row.original.status as TransactionStatus;

          if (status === 'Settled') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Settled</span>
              </span>
            );
          }

          if (status === 'Pending') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span>Pending</span>
              </span>
            );
          }

          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              <span>Failed</span>
            </span>
          );
        },
      },
      // Category
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span className="text-xs text-zinc-300 font-medium">
            {row.original.category}
          </span>
        ),
      },
      // Payment Method
      {
        accessorKey: 'paymentMethod',
        header: 'Payment method',
        cell: ({ row }) => (
          <span className="text-xs text-zinc-400 font-mono">
            {row.original.paymentMethod}
          </span>
        ),
      },
      // Pipeline (mono)
      {
        accessorKey: 'pipeline',
        header: 'Pipeline',
        cell: ({ row }) => (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-800/50 border border-zinc-800">
            {row.original.pipeline}
          </span>
        ),
      },
      // Created at (UTC sortable)
      {
        accessorKey: 'createdAt',
        header: () => (
          <button
            onClick={() => onSortChange('CreatedAt')}
            className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
          >
            <span>Created at (UTC)</span>
            {sortBy?.toLowerCase() === 'createdat' ? (
              sortDescending ? (
                <ArrowDown className="w-3 h-3 text-emerald-400" />
              ) : (
                <ArrowUp className="w-3 h-3 text-emerald-400" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-zinc-600 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          const formatted = date.toISOString().replace('T', ' ').slice(0, 19);
          return (
            <span className="font-mono text-xs text-zinc-400">
              {formatted}
            </span>
          );
        },
      },
      // Actions
      {
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex justify-end">
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [allSelected, someSelected, selectedIds, sortBy, sortDescending, onSortChange, onToggleSelectAll, onToggleSelectRow]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-[#111113] border border-zinc-800/70 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-zinc-800/80 bg-[#141416]/90 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-3 px-3.5 select-none whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              // Animated Skeletons during loading
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="h-12 animate-pulse bg-zinc-900/20">
                  <td className="px-3.5 py-3">
                    <div className="w-3.5 h-3.5 bg-zinc-800 rounded mx-auto" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-20 h-3.5 bg-zinc-800 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-28 h-3.5 bg-zinc-800 rounded mb-1" />
                    <div className="w-16 h-2.5 bg-zinc-800/60 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-16 h-3.5 bg-zinc-800 rounded ml-auto" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-16 h-5 bg-zinc-800/70 rounded-full" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-20 h-3.5 bg-zinc-800 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-24 h-3.5 bg-zinc-800 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-20 h-4 bg-zinc-800/70 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-28 h-3.5 bg-zinc-800 rounded" />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="w-4 h-4 bg-zinc-800 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-zinc-500 text-xs">
                  No transactions found matching the active criteria.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isSelected = selectedIds.has(row.original.id);
                return (
                  <tr
                    key={row.id}
                    className={`h-11 sm:h-12 transition-colors duration-150 ${
                      isSelected
                        ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                        : 'hover:bg-zinc-800/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3.5 py-2.5 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
