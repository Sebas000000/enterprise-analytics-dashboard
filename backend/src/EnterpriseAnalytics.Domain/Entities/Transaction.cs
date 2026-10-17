using EnterpriseAnalytics.Domain.Enums;

namespace EnterpriseAnalytics.Domain.Entities;

public class Transaction
{
    public string Id { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerAccountId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionStatus Status { get; set; }
    public string Category { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string Pipeline { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Transaction()
    {
    }

    public Transaction(
        string id,
        string customerName,
        string customerAccountId,
        decimal amount,
        TransactionStatus status,
        string category,
        string paymentMethod,
        string pipeline,
        DateTime createdAt)
    {
        Id = id;
        CustomerName = customerName;
        CustomerAccountId = customerAccountId;
        Amount = amount;
        Status = status;
        Category = category;
        PaymentMethod = paymentMethod;
        Pipeline = pipeline;
        CreatedAt = createdAt;
    }
}
