## Release v1.1.1 (Staging Pending)

### Changes
- **Color Contrast & Typography Remediation**: Resolved camouflaged text, washed-out labels, and low-contrast button states across shared components and cockpit views to guarantee WCAG AA accessibility compliance.

### Artifacts to Deploy
- Frontend build assets via Cloudflare Pages

### Database Checklist
- No D1 schema migrations required.

## Release v1.1.0 (Staging Pending)

### Changes
- **Map Upgrade**: Replaced basic 2D Leaflet map with a modern WebGL-accelerated 3D MapLibre GL mapping engine.
- **Light Theme**: Transitioned global interface styling from dark mode to a fresh light mode palette.
- **Clean State**: Reset and cleared all initial dummy profile and session data from state stores.

### Artifacts to Deploy
- Frontend build assets via Cloudflare Pages
- MapLibre CSS/JS components

### Database Checklist
- No D1 schema migrations required.

## Release v1.0.0 (Staging Pending)

### Artifacts to Deploy
- Frontend build assets via Cloudflare Pages
- Pages Functions routes (`/functions/api/`)
- Workers handler (`/worker/index.ts`)
- Cloudflare D1 migrations (`migrations/0001_create_users_and_rides.sql`)

### Database Checklist
- [x] Run D1 migrations locally.
- [ ] Apply D1 migrations to production (`pnpm wrangler d1 migrations apply openrides_db --remote`).
