using EnterpriseAnalytics.Domain.Entities;
using EnterpriseAnalytics.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EnterpriseAnalytics.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(t => t.CustomerName)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(t => t.CustomerAccountId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(t => t.Amount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(t => t.Status)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(t => t.Category)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(t => t.PaymentMethod)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.Pipeline)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        // Optimized Indexes for High-Throughput Reads and Filtering
        builder.HasIndex(t => t.CreatedAt);
        builder.HasIndex(t => t.Status);
        builder.HasIndex(t => t.Category);
        builder.HasIndex(t => t.CustomerName);
        builder.HasIndex(t => t.Pipeline);
        builder.HasIndex(t => t.CustomerAccountId);
    }
}
