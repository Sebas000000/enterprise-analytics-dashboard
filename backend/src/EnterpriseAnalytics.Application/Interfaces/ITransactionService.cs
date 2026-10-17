using EnterpriseAnalytics.Application.Common.Models;
using EnterpriseAnalytics.Application.DTOs.Transactions;

namespace EnterpriseAnalytics.Application.Interfaces;

public interface ITransactionService
{
    Task<PagedResult<TransactionDto>> GetTransactionsAsync(GetTransactionsQuery query, CancellationToken cancellationToken = default);
    Task<byte[]> ExportTransactionsCsvAsync(GetTransactionsQuery query, CancellationToken cancellationToken = default);
}
