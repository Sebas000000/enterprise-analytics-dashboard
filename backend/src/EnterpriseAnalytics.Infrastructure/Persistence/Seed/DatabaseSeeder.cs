using EnterpriseAnalytics.Domain.Entities;
using EnterpriseAnalytics.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EnterpriseAnalytics.Infrastructure.Persistence.Seed;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(ApplicationDbContext context, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (await _context.Transactions.AnyAsync(cancellationToken))
            {
                _logger.LogInformation("Database already seeded with transactions. Skipping.");
                return;
            }

            _logger.LogInformation("Seeding initial dataset for Enterprise Analytics Dashboard...");

            var seedData = GenerateSeedTransactions();
            await _context.Transactions.AddRangeAsync(seedData, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully seeded {Count} transactions into database.", seedData.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private static List<Transaction> GenerateSeedTransactions()
    {
        var now = DateTime.UtcNow;

        // Base 12 required core showcase transactions from UI specification
        var list = new List<Transaction>
        {
            new("txn_8f2c9a01", "Acme Corporation", "acct_00241", 14850.00m, TransactionStatus.Settled, "Subscription", "ACH transfer", "ach_enterprise", now.AddMinutes(-12)),
            new("txn_7b3e1c94", "Linear Labs", "acct_00109", 3200.50m, TransactionStatus.Settled, "Usage", "Visa · 4242", "stripe_usage", now.AddMinutes(-34)),
            new("txn_6a2d9f83", "Vercel Inc.", "acct_00455", 9420.00m, TransactionStatus.Settled, "Invoice", "Wire Transfer", "ach_enterprise", now.AddHours(-1).AddMinutes(-5)),
            new("txn_5c1e8b72", "Notion Labs", "acct_00388", 7800.00m, TransactionStatus.Pending, "Subscription", "MC · 5556", "stripe_primary", now.AddHours(-2).AddMinutes(-18)),
            new("txn_4d0f7a61", "Figma Inc.", "acct_00512", 12350.75m, TransactionStatus.Settled, "Invoice", "ACH transfer", "ach_enterprise", now.AddHours(-3).AddMinutes(-42)),
            new("txn_3e9a6f50", "Retool", "acct_00293", 4500.00m, TransactionStatus.Settled, "Subscription", "Visa · 9012", "stripe_primary", now.AddHours(-5).AddMinutes(-10)),
            new("txn_2f8b5e4f", "Mercury Technologies", "acct_00701", 18900.00m, TransactionStatus.Settled, "Invoice", "ACH transfer", "ach_enterprise", now.AddHours(-6).AddMinutes(-27)),
            new("txn_1a7c4d3e", "Ramp Financial", "acct_00689", 6400.25m, TransactionStatus.Failed, "Usage", "Visa · 1188", "stripe_usage", now.AddHours(-8).AddMinutes(-50)),
            new("txn_0b6d3c2d", "Supabase Inc.", "acct_00844", 2850.00m, TransactionStatus.Settled, "Subscription", "Amex · 3004", "stripe_eu", now.AddHours(-11).AddMinutes(-15)),
            new("txn_9c5e2b1c", "Resend", "acct_00192", 1120.00m, TransactionStatus.Settled, "Usage", "Visa · 4242", "stripe_usage", now.AddHours(-14).AddMinutes(-33)),
            new("txn_8d4f1a0b", "PlanetScale", "acct_00931", 5600.00m, TransactionStatus.Pending, "Subscription", "MC · 7712", "stripe_primary", now.AddHours(-17).AddMinutes(-45)),
            new("txn_7e3a09fa", "Raycast", "acct_00315", 890.00m, TransactionStatus.Settled, "Subscription", "Visa · 4242", "stripe_eu", now.AddHours(-20).AddMinutes(-2))
        };

        // Realistic complementary transactions to reach 65+ total entries
        var companies = new[]
        {
            ("Datadog", "acct_01021", 8450.00m, "Invoice", "ACH transfer", "ach_enterprise"),
            ("Snowflake", "acct_01022", 24500.00m, "Invoice", "Wire Transfer", "ach_enterprise"),
            ("Cloudflare", "acct_01023", 4200.00m, "Usage", "Visa · 8890", "stripe_usage"),
            ("OpenAI", "acct_01024", 38900.00m, "Usage", "ACH transfer", "ach_enterprise"),
            ("GitHub", "acct_01025", 6700.00m, "Subscription", "Visa · 4242", "stripe_primary"),
            ("Anthropic", "acct_01026", 29800.00m, "Usage", "ACH transfer", "ach_enterprise"),
            ("Docker", "acct_01027", 3400.00m, "Subscription", "MC · 5556", "stripe_primary"),
            ("Postman", "acct_01028", 2900.00m, "Subscription", "Visa · 1044", "stripe_primary"),
            ("Sentry", "acct_01029", 4150.00m, "Usage", "Amex · 4001", "stripe_usage"),
            ("Temporal Technologies", "acct_01030", 5200.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("Neon Database", "acct_01031", 1850.00m, "Usage", "Visa · 4242", "stripe_eu"),
            ("Railway Corp", "acct_01032", 1420.00m, "Usage", "MC · 8011", "stripe_usage"),
            ("Fly.io", "acct_01033", 2650.00m, "Usage", "Visa · 4242", "stripe_eu"),
            ("Prisma Data Inc.", "acct_01034", 1950.00m, "Subscription", "Visa · 6610", "stripe_primary"),
            ("Tailwind Labs", "acct_01035", 980.00m, "Subscription", "Amex · 9022", "stripe_primary"),
            ("Astro Technology", "acct_01036", 750.00m, "Subscription", "Visa · 4242", "stripe_eu"),
            ("Turborepo", "acct_01037", 2100.00m, "Subscription", "MC · 4432", "stripe_primary"),
            ("Render Services", "acct_01038", 3250.00m, "Usage", "Visa · 1190", "stripe_usage"),
            ("Scale AI", "acct_01039", 19200.00m, "Invoice", "ACH transfer", "ach_enterprise"),
            ("Hugging Face", "acct_01040", 8700.00m, "Usage", "Visa · 7719", "stripe_eu"),
            ("Grafana Labs", "acct_01041", 5300.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("HashiCorp", "acct_01042", 11400.00m, "Invoice", "Wire Transfer", "ach_enterprise"),
            ("Algolia", "acct_01043", 4600.00m, "Usage", "Visa · 4242", "stripe_usage"),
            ("LaunchDarkly", "acct_01044", 3900.00m, "Subscription", "MC · 9981", "stripe_primary"),
            ("WorkOS", "acct_01045", 2800.00m, "Subscription", "Visa · 4242", "stripe_primary"),
            ("Clerk Dev", "acct_01046", 1650.00m, "Usage", "Visa · 4242", "stripe_usage"),
            ("Inngest Inc.", "acct_01047", 1250.00m, "Subscription", "Amex · 3004", "stripe_primary"),
            ("Upstash", "acct_01048", 890.00m, "Usage", "Visa · 4242", "stripe_eu"),
            ("Plausible Analytics", "acct_01049", 450.00m, "Subscription", "MC · 1289", "stripe_eu"),
            ("Cal.com Inc.", "acct_01050", 1100.00m, "Subscription", "Visa · 4242", "stripe_primary"),
            ("Loom Video", "acct_01051", 3100.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("Miro Collaboration", "acct_01052", 6200.00m, "Subscription", "Visa · 7710", "stripe_primary"),
            ("ClickUp", "acct_01053", 4800.00m, "Subscription", "MC · 2241", "stripe_primary"),
            ("Asana", "acct_01054", 5900.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("Intercom", "acct_01055", 7400.00m, "Subscription", "Visa · 4242", "stripe_eu"),
            ("Customer.io", "acct_01056", 3600.00m, "Usage", "Amex · 8812", "stripe_usage"),
            ("Segment by Twilio", "acct_01057", 8900.00m, "Usage", "Wire Transfer", "ach_enterprise"),
            ("Twilio Inc.", "acct_01058", 12400.00m, "Usage", "ACH transfer", "ach_enterprise"),
            ("SendGrid", "acct_01059", 4300.00m, "Usage", "Visa · 4242", "stripe_usage"),
            ("Mixpanel", "acct_01060", 3800.00m, "Subscription", "MC · 5556", "stripe_primary"),
            ("Amplitude", "acct_01061", 6700.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("Heap Inc.", "acct_01062", 2900.00m, "Subscription", "Visa · 3109", "stripe_primary"),
            ("PagerDuty", "acct_01063", 4750.00m, "Subscription", "Visa · 4242", "stripe_primary"),
            ("Databricks", "acct_01064", 31200.00m, "Invoice", "Wire Transfer", "ach_enterprise"),
            ("Confluent Cloud", "acct_01065", 14300.00m, "Usage", "ACH transfer", "ach_enterprise"),
            ("Elastic NV", "acct_01066", 7600.00m, "Subscription", "Visa · 9912", "stripe_primary"),
            ("Redis Enterprise", "acct_01067", 5800.00m, "Subscription", "ACH transfer", "ach_enterprise"),
            ("MongoDB Atlas", "acct_01068", 9900.00m, "Usage", "Visa · 4242", "stripe_usage"),
            ("Apollo GraphQL", "acct_01069", 2400.00m, "Subscription", "Amex · 5011", "stripe_primary"),
            ("Prisma Cloud", "acct_01070", 8100.00m, "Invoice", "ACH transfer", "ach_enterprise"),
            ("Harness CI/CD", "acct_01071", 6300.00m, "Subscription", "Wire Transfer", "ach_enterprise"),
            ("CircleCI", "acct_01072", 3700.00m, "Subscription", "Visa · 4242", "stripe_primary"),
            ("Bitbucket Cloud", "acct_01073", 2200.00m, "Subscription", "MC · 7710", "stripe_primary"),
            ("SonarSource", "acct_01074", 1800.00m, "Subscription", "Visa · 4242", "stripe_eu")
        };

        var random = new Random(42); // deterministic seed for consistent reproducibility
        var hexChars = "0123456789abcdef";

        for (int i = 0; i < companies.Length; i++)
        {
            var item = companies[i];
            var hashHex = new string(Enumerable.Range(0, 8).Select(_ => hexChars[random.Next(hexChars.Length)]).ToArray());
            var txnId = $"txn_{hashHex}";

            // Distribute status realistically: 82% Settled, 12% Pending, 6% Failed
            var roll = random.Next(100);
            var status = roll switch
            {
                < 80 => TransactionStatus.Settled,
                < 93 => TransactionStatus.Pending,
                _ => TransactionStatus.Failed
            };

            var daysAgo = (double)i * 0.5 + random.NextDouble() * 0.3;
            var createdDate = now.AddDays(-daysAgo).AddMinutes(-random.Next(5, 55));

            list.Add(new Transaction(
                txnId,
                item.Item1,
                item.Item2,
                item.Item3,
                status,
                item.Item4,
                item.Item5,
                item.Item6,
                createdDate
            ));
        }

        return list;
    }
}
