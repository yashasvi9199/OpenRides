# Release Staging Records

## Release v1.0.0 (Staging Pending)

### Artifacts to Deploy
- Frontend build assets via Cloudflare Pages
- Pages Functions routes (`/functions/api/`)
- Workers handler (`/worker/index.ts`)
- Cloudflare D1 migrations (`migrations/0001_create_users_and_rides.sql`)

### Database Checklist
- [x] Run D1 migrations locally.
- [ ] Apply D1 migrations to production (`pnpm wrangler d1 migrations apply openrides_db --remote`).
