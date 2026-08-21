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

- **Wrangler**: configured in `wrangler.json` mapping D1 SQLite database binding `DB` and R2 bucket binding `BUCKET`.
- **Feature Architecture**: code organized under `src/features/` with local styles and types isolated per module.
