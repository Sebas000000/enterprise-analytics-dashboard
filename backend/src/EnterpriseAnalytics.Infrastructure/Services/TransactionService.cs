using EnterpriseAnalytics.Application.Common.Models;
using EnterpriseAnalytics.Application.DTOs.Transactions;
using EnterpriseAnalytics.Application.Interfaces;
using EnterpriseAnalytics.Domain.Entities;
using EnterpriseAnalytics.Domain.Enums;
using EnterpriseAnalytics.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EnterpriseAnalytics.Infrastructure.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;
    private readonly ICsvExportService _csvExportService;
    private readonly ILogger<TransactionService> _logger;

    public TransactionService(
        ApplicationDbContext context,
        ICsvExportService csvExportService,
        ILogger<TransactionService> logger)
    {
        _context = context;
        _csvExportService = csvExportService;
        _logger = logger;
    }

    public async Task<PagedResult<TransactionDto>> GetTransactionsAsync(GetTransactionsQuery query, CancellationToken cancellationToken = default)
    {
        var queryable = BuildFilteredQuery(query);

        var totalCount = await queryable.CountAsync(cancellationToken);

        queryable = ApplySorting(queryable, query.SortBy, query.SortDescending);

        var skip = (query.PageNumber - 1) * query.PageSize;
        var items = await queryable
            .Skip(skip)
            .Take(query.PageSize)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                CustomerName = t.CustomerName,
                CustomerAccountId = t.CustomerAccountId,
                Amount = t.Amount,
                Status = t.Status.ToString(),
                Category = t.Category,
                PaymentMethod = t.PaymentMethod,
                Pipeline = t.Pipeline,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<TransactionDto>(items, totalCount, query.PageNumber, query.PageSize);
    }

    public async Task<byte[]> ExportTransactionsCsvAsync(GetTransactionsQuery query, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Exporting transactions to CSV with filter: Status={Status}, Category={Category}, Search={Search}",
            query.Status, query.Category, query.SearchTerm);

        var queryable = BuildFilteredQuery(query);
        queryable = ApplySorting(queryable, query.SortBy, query.SortDescending);

        // Fetch up to 10,000 records streaming with AsNoTracking
        var items = await queryable
            .Take(10000)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                CustomerName = t.CustomerName,
                CustomerAccountId = t.CustomerAccountId,
                Amount = t.Amount,
                Status = t.Status.ToString(),
                Category = t.Category,
                PaymentMethod = t.PaymentMethod,
                Pipeline = t.Pipeline,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return _csvExportService.ExportTransactionsToCsv(items);
    }

    private IQueryable<Transaction> BuildFilteredQuery(GetTransactionsQuery query)
    {
        var queryable = _context.Transactions.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var search = query.SearchTerm.Trim().ToLower();
            queryable = queryable.Where(t =>
                t.CustomerName.ToLower().Contains(search) ||
                t.CustomerAccountId.ToLower().Contains(search) ||
                t.Id.ToLower().Contains(search) ||
                t.PaymentMethod.ToLower().Contains(search) ||
                t.Pipeline.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            if (Enum.TryParse<TransactionStatus>(query.Status, true, out var parsedStatus))
            {
                queryable = queryable.Where(t => t.Status == parsedStatus);
            }
        }

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            var category = query.Category.Trim().ToLower();
            queryable = queryable.Where(t => t.Category.ToLower() == category);
        }

        return queryable;
    }

    private static IQueryable<Transaction> ApplySorting(IQueryable<Transaction> queryable, string? sortBy, bool sortDescending)
    {
        var sortColumn = (sortBy ?? "CreatedAt").ToLowerInvariant();

        return (sortColumn, sortDescending) switch
        {
            ("amount", false) => queryable.OrderBy(t => t.Amount),
            ("amount", true) => queryable.OrderByDescending(t => t.Amount),
            ("customername", false) => queryable.OrderBy(t => t.CustomerName),
            ("customername", true) => queryable.OrderByDescending(t => t.CustomerName),
            ("status", false) => queryable.OrderBy(t => t.Status),
            ("status", true) => queryable.OrderByDescending(t => t.Status),
            ("category", false) => queryable.OrderBy(t => t.Category),
            ("category", true) => queryable.OrderByDescending(t => t.Category),
            ("pipeline", false) => queryable.OrderBy(t => t.Pipeline),
            ("pipeline", true) => queryable.OrderByDescending(t => t.Pipeline),
            ("createdat", false) => queryable.OrderBy(t => t.CreatedAt),
            _ => queryable.OrderByDescending(t => t.CreatedAt)
        };
    }
}
