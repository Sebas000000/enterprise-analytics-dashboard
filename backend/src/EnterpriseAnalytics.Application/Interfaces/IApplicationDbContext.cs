using EnterpriseAnalytics.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseAnalytics.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Transaction> Transactions { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
