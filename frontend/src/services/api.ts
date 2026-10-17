import type { AnalyticsSummary, PagedResult, Transaction, TransactionFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await fetch(`${API_BASE_URL}/analytics/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics summary: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTransactions(filters: TransactionFilters): Promise<PagedResult<Transaction>> {
  const params = new URLSearchParams();
  params.set('pageNumber', filters.pageNumber.toString());
  params.set('pageSize', filters.pageSize.toString());

  if (filters.status && filters.status !== 'All') {
    params.set('status', filters.status);
  }

  if (filters.category && filters.category !== 'All') {
    params.set('category', filters.category);
  }

  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    params.set('searchTerm', filters.searchTerm.trim());
  }

  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }

  if (filters.sortDescending !== undefined) {
    params.set('sortDescending', filters.sortDescending.toString());
  }

  const response = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }
  return response.json();
}

export async function downloadTransactionsCsv(filters: TransactionFilters): Promise<void> {
  const params = new URLSearchParams();
  params.set('pageNumber', '1');
  params.set('pageSize', '10000'); // Export all matching active filters

  if (filters.status && filters.status !== 'All') {
    params.set('status', filters.status);
  }

  if (filters.category && filters.category !== 'All') {
    params.set('category', filters.category);
  }

  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    params.set('searchTerm', filters.searchTerm.trim());
  }

  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }

  if (filters.sortDescending !== undefined) {
    params.set('sortDescending', filters.sortDescending.toString());
  }

  const response = await fetch(`${API_BASE_URL}/transactions/export/csv?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to export CSV: ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.download = `transactions_export_${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
