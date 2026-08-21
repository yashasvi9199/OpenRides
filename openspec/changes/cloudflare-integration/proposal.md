## Why

The application currently lacks a server-side backend integration for hosting, data storage, and heavy authentication workflows. Introducing Cloudflare Integration (Pages functions, Workers, D1 database, and R2 storage) provides a scalable, edge-based backend aligned with strict performance and architectural requirements.

## What Changes

- Add Cloudflare Wrangler configuration and setup for backend.
- Create `functions/` directory for Cloudflare Pages Functions (upload/download, data fetching).
- Create `worker/` directory for Cloudflare Workers (heavy APIs like Authentication and password reset).
- Configure Cloudflare D1 SQLite database mapping for application storage.
- Configure Cloudflare R2 bucket mapping for secure file/media storage.
- Re-architect the workspace structure to be strictly feature-based.
- Implement rate limiting, security headers, input validation, and secure storage practices.

## Capabilities

### New Capabilities
- `backend/cloudflare-infrastructure`: Cloudflare Workers, Pages Functions, D1 DB, and R2 setup with wrangler and typescript configuration.

### Modified Capabilities

## Impact

- Affects project structure (Vite configuration, feature layouts).
- Adds wrangler configuration (`wrangler.json`, `wrangler.toml`).
- Adds cloudflare worker and pages function handlers.
