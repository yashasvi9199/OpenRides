## Context

Transitioning to light mode caused contrast regressions. Modals are also less intuitive on larger layouts, and Vite needs MapLibre worker exclusions. Geolocation must also initialize immediately to center correctly. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Transition subviews (GroupSync, QR modal, History modal) into full-screen inline page views.
- Exclude `maplibre-gl` in `vite.config.ts`'s `optimizeDeps` property.
- Query GPS geolocator on map mount to set starting coordinates.
- Redesign overlay controls to use dark tactical theme elements.
- Inline the MapLibre web worker utilizing Vite inlined web worker queries.
- Refine font clamp sizes and responsive padding variables.
- Rewrite E2E test scripts to utilize Playwright in low-resource headless configuration.
- Implement Cloudflare KV Caching system for backend database queries and mutations.

**Non-Goals:**
- Modifying backend server logic or Wrangler bindings.

## Decisions

### 1. Vite optimization Excludes
Exclude `maplibre-gl` from Vite optimization to prevent worker load failures in web app.

### 2. MapLibre Worker Inlining
We will load `maplibre-gl-csp-worker` with a `?worker&inline` asset query, and register a custom `WORKER_PROVIDER` in `maplibregl.config` to package the worker inside the main bundle, bypassing network load and caching errors.

### 3. Full-Screen Page Subviews
Refactor `DesktopView` and `MobileView` to render pages inline based on `activeView` state, removing overlay popups.

### 4. Dark Tactical Theme Map Controls
Implement dark slate (`bg-slate-900`, `border-slate-800`, `text-white`) overlays for map instruments to maintain high contrast.

### 5. Playwright E2E Tests (Low-Resource Headless)
Migrate the E2E verification tests to Playwright using lightweight CLI run commands with sandbox/GPU disabled to conserve target memory and CPU.
We will implement two separate scripts:
1. `scratchpad/test-master.ts`: Runs a master E2E test verifying all application elements and page transitions sequentially.
2. Individual test scripts (e.g. `scratchpad/test-map.ts`, `scratchpad/test-profile.ts`) checking individual pages.
Each test case SHALL vigorously evaluate elements by executing at least 5 verification scenarios (e.g., presence, visibility, typography weight, bounds clipping, content alignment, and interactive state triggers).

### 6. Cloudflare KV Caching System
Implement a Cache-Aside pattern with Write-Invalidate across Cloudflare KV instantly on DB mutations. Features:
- Explicit TTL is mandatory.
- Wrap all cache reads/writes in `try/catch` to fail-open directly to the primary DB without crashing.
- Namespace all keys with UUIDs.
- Absolute ban on caching PII, passwords, or raw session tokens.

## Risks / Trade-offs

- [Risk] Page navigation might feel slow compared to instantaneous modals.
  - *Mitigation:* Keep state in Zustand store to ensure zero-latency re-renders.
- [Risk] Cache consistency issues.
  - *Mitigation:* Enforce Write-Invalidate instantly on database update operations.
