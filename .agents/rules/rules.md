# Enterprise Analytics Dashboard Rules (Geist / Linear / Artifacts Aesthetic)

## 1. Visual & Color System
- Canvas background: `#09090b` (Deep Obsidian).
- Card / Panel background: `#111113` with 1px fine border `border-zinc-800/70` and rounded-lg (`rounded-md` or `rounded-lg`).
- Typography pairing:
  * Primary UI / Labels: Inter or Geist Sans (`font-sans tracking-tight`).
  * Numerical data, IDs, timestamps, pipelines: JetBrains Mono or Geist Mono (`font-mono text-xs` or `text-sm`).
- Status Badge Indicators (Pill format with 1.5px glowing dot):
  * Settled: `text-emerald-400 bg-emerald-950/40 border border-emerald-800/40` + green dot.
  * Pending: `text-amber-400 bg-amber-950/40 border border-amber-800/40` + yellow dot.
  * Failed: `text-rose-400 bg-rose-950/40 border border-rose-800/40` + red dot.

## 2. Density & Micro-interactions
- Dense table rows: Height between 44px - 48px, subtle row hover (`hover:bg-zinc-800/30 transition-colors duration-150`).
- Interactive triggers: Sparkline mini-charts in KPI cards, active click scale (`active:scale-[0.98]`), and tooltip support on info icons.
- Top Control Bar: Segmented pill tabs (`All 1,420`, `Settled`, `Pending`, `Failed`), unified search input with `/` shortcut trigger.

## 3. Engineering Rigor (.NET 8 + Clean Architecture)
- Domain entities decoupled from DTOs.
- Server-side pagination, multi-criteria filtering, and export streaming (CSV / PDF) with `AsNoTracking()` for high-throughput reads.
- Multi-container Docker Compose with PostgreSQL/SQL Server.
