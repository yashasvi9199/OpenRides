## Context

See proposal.md - Why.
The frontend has basic skeleton components, but there is no integrated Cloudflare backend (Pages Functions, Workers, D1 DB, R2 Storage) or strict security/rate-limiting/validation infrastructure in place.

## Goals / Non-Goals

**Goals:**
- Set up Cloudflare D1 SQLite database and migrations.
- Set up Cloudflare R2 Storage integration.
- Setup `functions/` and `worker/` directories mapped correctly in Wrangler configuration.
- Implement Zod schema validation, UUID generator for IDs, and strict security headers.
- Implement tiered rate limiting (Token Bucket 30/60s, Fixed Window 1/120s).
- Restructure frontend into a strict feature-based layout with dedicated styles and type files.

**Non-Goals:**
- Deploying the worker to production.
- Upgrading Leaflet map package versions.

## Decisions

### 1. Project Directory Restructuring
- **Decision:** Restructure `src/features/` modules to be strictly self-contained.
- **Details:** Each feature module (e.g., `src/features/auth`, `src/features/sos`, etc.) will have its own `.styles.css` and `.types.ts` file, removing any shared stylesheet import paths.
- **Alternatives Considered:** Flat structure under src (rejected due to rule compliance and code cleanliness).

### 2. Wrangler Configuration
- **Decision:** Use a single `wrangler.json` (or `wrangler.toml`) at the root to bind Pages (`functions/`) and configure local D1 & R2 bindings.
- **Details:** Declare D1 database binding `DB` and R2 bucket binding `BUCKET`.

### 3. Backend Rate Limiting
- **Decision:** Implement token bucket and fixed-window in-memory or KV-based rate limiting.
- **Details:** Workers and Pages Functions will consume a helper rate-limiter class. General routes use token bucket (30 req/60s). Sensitive endpoints (Auth/Reset) use fixed window (1 req/120s).

### 4. Database Schema and Migrations
- **Decision:** Write raw SQL migrations under `migrations/` and track via `docs/DATABASE.sql` ledger.
- **Details:** Bind tables for users, sessions, rides, SOS events. Always use UUID for IDs.

## Risks / Trade-offs

- [Risk] Local D1 SQLite configuration divergence from production.
  - Mitigation: Maintain strict SQL migration scripts and execute them with Wrangler CLI.
- [Risk] Exceeding 150 lines per function or 300 lines per file in backend handlers.
  - Mitigation: Strictly modularize routes and write helper subroutines in utility modules.
