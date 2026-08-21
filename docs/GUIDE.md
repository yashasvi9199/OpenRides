# OpenRides Developer Guide

## Onboarding Steps

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run database migrations locally:
   ```bash
   pnpm wrangler d1 migrations apply openrides_db --local
   ```
3. Start local development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Configure these in `dev.vars` for local development:
- `GEMINI_API_KEY`: Required for Gemini AI API calls.
- `APP_URL`: The URL where this applet is hosted.

## Configurations

- **Wrangler**: configured in `wrangler.json` mapping D1 SQLite database binding `DB`, R2 bucket binding `BUCKET`, and KV namespace binding `CACHE`.
- **Feature Architecture**: code organized under `src/features/` with local styles and types isolated per module.

## Headless Playwright E2E Testing Scripts

Playwright tests run in headless mode with low-resource flags (`--disable-gpu`, `--no-sandbox`, `--disable-dev-shm-usage`) using programmatic Vite dev servers:
- **Master Test Suite**: `pnpm tsx scratchpad/test-master.ts` (verifies entire integration workflow)
- **Map Features Suite**: `pnpm tsx scratchpad/test-map.ts` (verifies 3D maps, autocomplete, layers)
- **Profile / ICE Suite**: `pnpm tsx scratchpad/test-profile.ts` (verifies medical profiles and ICE forms)

## Cloudflare KV Caching

- **Cache-Aside Pattern**: Login profiles and ride queries first check the name-spaced `CACHE` KV binding with explicit TTL expiry configurations. On cache misses, queries fail-open directly to D1 SQLite database before populating KV cache.
