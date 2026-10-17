using EnterpriseAnalytics.Application.Common.Models;
using EnterpriseAnalytics.Application.DTOs.Transactions;
using EnterpriseAnalytics.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriseAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(
        ITransactionService transactionService,
        ILogger<TransactionsController> logger)
    {
        _transactionService = transactionService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a paginated list of transactions with server-side multi-criteria filtering and sorting.
    /// </summary>
    /// <param name="query">Pagination, search and filtering parameters.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Paged result containing transactions and metadata.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TransactionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<TransactionDto>>> GetTransactions(
        [FromQuery] GetTransactionsQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing transactions query: Page={Page}, Size={Size}, Search={Search}, Status={Status}",
            query.PageNumber, query.PageSize, query.SearchTerm, query.Status);

        var result = await _transactionService.GetTransactionsAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Direct streaming export of transactions matching the active filters into an RFC-compliant CSV file.
    /// </summary>
    /// <param name="query">Active search and filter criteria.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>CSV file download stream.</returns>
    [HttpGet("export/csv")]
    [Produces("text/csv")]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportCsv(
        [FromQuery] GetTransactionsQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Streaming CSV export for transactions with active filter: Search={Search}, Status={Status}",
            query.SearchTerm, query.Status);

        var csvBytes = await _transactionService.ExportTransactionsCsvAsync(query, cancellationToken);
        var fileName = $"transactions_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";

        return File(csvBytes, "text/csv", fileName);
    }
}
