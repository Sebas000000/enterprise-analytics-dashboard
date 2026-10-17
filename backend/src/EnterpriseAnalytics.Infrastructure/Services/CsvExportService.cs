using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using EnterpriseAnalytics.Application.DTOs.Transactions;
using EnterpriseAnalytics.Application.Interfaces;

namespace EnterpriseAnalytics.Infrastructure.Services;

public class CsvExportService : ICsvExportService
{
    public byte[] ExportTransactionsToCsv(IEnumerable<TransactionDto> transactions)
    {
        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8))
        using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ","
        }))
        {
            csv.WriteRecords(transactions);
            writer.Flush();
        }

        return memoryStream.ToArray();
    }
}
