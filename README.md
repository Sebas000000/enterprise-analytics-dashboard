# Enterprise Analytics & Financial Transactions Ledger

[![.NET 8](https://img.shields.io/badge/.NET-8.0_LTS-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Alpine-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade financial analytics dashboard and high-throughput transactions ledger. Engineered with strict **Clean Architecture** on **.NET 8 LTS**, **Entity Framework Core 8**, **PostgreSQL 16**, and a **React 19 + Vite** frontend inspired by the minimalist, high-density aesthetics of **Linear**, **Geist**, and **Claude Artifacts**.

---

## Architecture Highlights

### 1. Strict Clean Architecture (.NET 8)
- **Domain Layer (`EnterpriseAnalytics.Domain`):** Pure enterprise POCOs (`Transaction`, `TransactionStatus`) decoupled from external frameworks, persistence mechanisms, or presentation concerns.
- **Application Layer (`EnterpriseAnalytics.Application`):** DTO contracts (`TransactionDto`, `AnalyticsSummaryDto`, `GetTransactionsQuery`), generic pagination abstraction (`PagedResult<T>`), and service interfaces (`ITransactionService`, `IAnalyticsService`, `ICsvExportService`).
- **Infrastructure Layer (`EnterpriseAnalytics.Infrastructure`):** PostgreSQL persistence configured with `Npgsql.EntityFrameworkCore.PostgreSQL`, optimized compound indexes, and non-blocking reads using `.AsNoTracking()` for ultra-high throughput.
- **Presentation API Layer (`EnterpriseAnalytics.Api`):** RESTful controllers, RFC 7807 global exception handling middleware, OpenAPI/Swagger documentation, and CORS security policies.

### 2. High-Performance Read Optimization
All queries implement EF Core `.AsNoTracking()`, drastically cutting memory allocation and garbage collection overhead during heavy read volume and concurrent reporting workloads.

### 3. Direct Streaming CSV Export
The `/api/transactions/export/csv` endpoint streams CSV records using RFC 4180 standard formatting directly through memory buffers, avoiding pagination constraints while respecting active multi-criteria filters.

### 4. Precision Design System (Deep Obsidian Theme)
- Canvas Background: `#09090b` (Deep Obsidian).
- Panels & Cards: `#111113` with 1px fine borders (`border-zinc-800/70`).
- Typography Pairing: `Inter` for primary interface elements and `JetBrains Mono` for IDs (`txn_...`), account numbers, currency amounts, and UTC timestamps.
- Status Badge Indicators: Pill-shaped badges with 1.5px glowing indicators for `Settled` (emerald), `Pending` (amber), and `Failed` (rose).

---

## Directory Tree

```
├── .env.example                               # Environment template
├── docker-compose.yml                         # 3-tier container orchestration (db, backend, frontend)
├── PROJECT_RULES.md                           # Architectural and visual standards
├── backend/                                   # .NET 8 Clean Architecture Solution
│   ├── EnterpriseAnalytics.sln
│   ├── Dockerfile                             # Multi-stage .NET 8 build & publish
│   └── src/
│       ├── EnterpriseAnalytics.Domain/        # Domain entities and business enums
│       ├── EnterpriseAnalytics.Application/   # Query objects, DTOs and interfaces
│       ├── EnterpriseAnalytics.Infrastructure/# EF Core, PostgreSQL seeder, CSV service
│       └── EnterpriseAnalytics.Api/           # Controllers, Swagger, exception middleware
└── frontend/                                  # React 19 + TypeScript + Vite Client
    ├── Dockerfile                             # Multi-stage Vite build + Nginx Alpine
    ├── nginx.conf                             # SPA routing & API reverse proxy
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── components/                        # TopNav, MetricCards, TableToolbar, TransactionTable
        ├── services/                          # API client with type-safe fetchers
        └── types/                             # Strict TypeScript interfaces
```

---

## Quick Start Guide

### Prerequisites
- [Docker](https://www.docker.com/) (v24+) and [Docker Compose](https://docs.docker.com/compose/) (v2.20+)
- *(Optional)* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) and [Node.js](https://nodejs.org/) (v20+) for local non-containerized development.

### Step 1: Clone and Configure Environment
Clone the repository and copy the environment variables template:

```bash
cp .env.example .env
```

### Step 2: Launch with a Single Command
Start the database, backend API, and frontend web client using Docker Compose:

```bash
docker compose up -d --build
```

Docker will:
1. Spin up **PostgreSQL 16** with a persistent volume and execute health checks.
2. Build and launch the **.NET 8 Web API**, automatically creating the database schema and seeding 66 realistic showcase transactions.
3. Build the **React Vite application** and serve it through a production-ready **Nginx Alpine** reverse proxy.

### Step 3: Access Points

| Service | URL | Notes |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5174` (or `http://localhost:5173`) | Enterprise Ledger interface with live metrics |
| **REST API** | `http://localhost:5000/api` | Base API endpoint |
| **Swagger UI** | `http://localhost:5000/swagger` | Interactive OpenAPI documentation |
| **Health Check** | `http://localhost:5000/health` | Returns `Healthy` status |

---

## Pre-loaded Showcase Data

The database automatically seeds on first launch with 66 realistic records, including key enterprise mockups:

- **Acme Corporation** (`txn_8f2c9a01` · `$14,850.00` · Settled · Subscription · ACH transfer · `ach_enterprise`)
- **Linear Labs** (`txn_7b3e1c94` · `$3,200.50` · Settled · Usage · Visa · 4242 · `stripe_usage`)
- **Vercel Inc.** (`txn_6a2d9f83` · `$9,420.00` · Settled · Invoice · Wire Transfer · `ach_enterprise`)
- **Notion Labs** (`txn_5c1e8b72` · `$7,800.00` · Pending · Subscription · MC · 5556 · `stripe_primary`)
- **Figma Inc.** (`txn_4d0f7a61` · `$12,350.75` · Settled · Invoice · ACH transfer · `ach_enterprise`)
- **Retool** (`txn_3e9a6f50` · `$4,500.00` · Settled · Subscription · Visa · 9012 · `stripe_primary`)
- **Mercury Technologies** (`txn_2f8b5e4f` · `$18,900.00` · Settled · Invoice · ACH transfer · `ach_enterprise`)
- **Ramp Financial** (`txn_1a7c4d3e` · `$6,400.25` · Failed · Usage · Visa · 1188 · `stripe_usage`)
- **Supabase Inc.** (`txn_0b6d3c2d` · `$2,850.00` · Settled · Subscription · Amex · 3004 · `stripe_eu`)
- **Resend** (`txn_9c5e2b1c` · `$1,120.00` · Settled · Usage · Visa · 4242 · `stripe_usage`)
- **PlanetScale** (`txn_8d4f1a0b` · `$5,600.00` · Pending · Subscription · MC · 7712 · `stripe_primary`)
- **Raycast** (`txn_7e3a09fa` · `$890.00` · Settled · Subscription · Visa · 4242 · `stripe_eu`)

---

## Stopping the Services

To shut down all containers and networks:

```bash
docker compose down
```

To remove all persistent database data:

```bash
docker compose down -v
```

---

## License

MIT © Enterprise Analytics Platform Engineering Team.