# OpenRides

OpenRides is a ride-safety web app for motorcyclists and families. It combines live ride telemetry, group ride coordination, and emergency/medical workflows with a Cloudflare-native backend (Pages Functions + Worker + D1 + R2 + KV).

## Why OpenRides

- Live group ride tracking with map overlays and telemetry
- Safety-first workflows (SOS trigger, crash countdown, check-ins)
- Public emergency profile view for first responders
- Family dashboard mode for guardian monitoring
- Cloudflare-backed API surface for auth, rides, and media

## Core Capabilities

### Rider & Group Ride
- Start, pause, resume, and stop rides
- Generate and share 6-digit group ride codes
- Approve/reject join requests
- Track speed, distance, route history, and rider status
- Manual refresh for participant location/state updates

### Safety & Emergency
- One-tap SOS mode with siren + haptic feedback
- Simulated crash detection with countdown escalation to SOS
- Periodic safety check-in timer reset
- Emergency contacts + medical profile storage
- QR/public emergency page (`/sos/:token`) for responders

### Mapping & Telemetry
- MapLibre-powered live map UI
- Multiple map styles/layers with fallback behavior
- GPS smoothing and filtering (Kalman + accuracy gate)
- Desktop and mobile responsive views

### Backend Platform
- Cloudflare Worker auth endpoints (`/api/auth/*`)
- Cloudflare Pages Functions for rides and media APIs (`/functions/api/*`)
- D1 SQLite for users/rides
- R2 for image storage (upload/download)
- Optional KV cache-aside reads for auth and ride lookups

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Zustand, MapLibre GL, Lucide
- **Backend:** Cloudflare Workers + Pages Functions, Zod validation
- **Data:** Cloudflare D1 (SQLite), R2, KV
- **Tooling:** pnpm, Wrangler, Playwright/Puppeteer utilities

## Repository Structure

```text
OpenRides/
├── src/                    # Frontend app (feature-based architecture)
│   ├── features/           # auth, ride, map, sos, view modules
│   ├── shared/             # shared UI components, utils, types
│   └── App.tsx             # app entry composition
├── functions/api/          # Cloudflare Pages Functions (rides/uploads/downloads)
├── worker/                 # Cloudflare Worker (auth + security/rate limiting)
├── migrations/             # D1 SQL migrations
├── docs/                   # guide, release notes, changelog, DB reference
├── scratchpad/             # headless testing scripts
└── wrangler.json           # Cloudflare bindings and worker config
```

## Prerequisites

- Node.js (LTS recommended)
- pnpm
- Cloudflare Wrangler CLI (installed via dependencies)

## Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create local worker env file:
   ```bash
   cp dev.vars.example dev.vars
   ```
3. Apply local D1 migrations:
   ```bash
   pnpm wrangler d1 migrations apply openrides_db --local
   ```
4. Start frontend dev server:
   ```bash
   pnpm dev
   ```

## Environment Variables

For local Cloudflare worker/function runtime (`dev.vars`):

- `GEMINI_API_KEY` — API key for Gemini integration
- `APP_URL` — app base URL for CORS/self-reference (example: `http://localhost:8787`)

Reference templates:
- `.env.example`
- `dev.vars.example`

## Available Scripts

From `package.json`:

- `pnpm dev` — start Vite dev server on port 3000
- `pnpm build` — production build
- `pnpm preview` — preview build output
- `pnpm lint` — TypeScript type-check (`tsc --noEmit`)
- `pnpm clean` — remove build artifacts

## API Surface

### Worker Auth APIs (`worker/index.ts`)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password`

Key behavior:
- Input validation with Zod
- CORS + security headers
- Token bucket and fixed-window rate limiting

### Pages Function APIs (`functions/api`)

- `GET /api/rides?id=<uuid>&limit=<n>&offset=<n>`
- `POST /api/uploads` (multipart file upload, PNG/JPEG validation, 5MB max)
- `GET /api/downloads?file=<uuid.(png|jpg)>`

## Database

D1 migration and schema references:

- Migration: `migrations/0001_create_users_and_rides.sql`
- SQL reference: `docs/DATABASE.sql`

Primary tables:
- `users`
- `rides`

## Testing

Type check:

```bash
pnpm lint
```

Headless integration scripts (from `docs/GUIDE.md`):

```bash
pnpm tsx scratchpad/test-master.ts
pnpm tsx scratchpad/test-map.ts
pnpm tsx scratchpad/test-profile.ts
```

## Deployment Notes

Production/staging releases are documented in:

- `docs/RELEASE.md`
- `docs/CHANGELOG.md`

Deployment targets:
- Cloudflare Pages frontend assets
- Pages Functions APIs
- Worker auth handler
- D1 migrations
- R2 and KV bindings from `wrangler.json`

## Documentation Index

- Developer onboarding: `docs/GUIDE.md`
- Changelog: `docs/CHANGELOG.md`
- Release checklist: `docs/RELEASE.md`
- Database SQL: `docs/DATABASE.sql`

---
