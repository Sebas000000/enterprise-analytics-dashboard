using EnterpriseAnalytics.Application.DTOs.Transactions;

namespace EnterpriseAnalytics.Application.Interfaces;

public interface ICsvExportService
{
    byte[] ExportTransactionsToCsv(IEnumerable<TransactionDto> transactions);
}
