namespace EnterpriseAnalytics.Application.DTOs.Transactions;

public class TransactionDto
{
    public string Id { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerAccountId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string Pipeline { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
