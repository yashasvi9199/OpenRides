## 1. Vite & Styles Optimization

- [ ] 1.1 Exclude `maplibre-gl` from Vite dependency optimization in `vite.config.ts`.
- [ ] 1.2 Remove Leaflet stylesheet link from `index.html`.
- [ ] 1.3 Update global font clamp ranges and container paddings inside `src/index.css`.
- [ ] 1.4 Inline the MapLibre GL web worker inside `LiveRideMap.tsx` using custom Vite worker provider imports.

## 2. High-Contrast Overlay Controls & Map Geolocator

- [ ] 2.1 Revert map control overlay containers and telemetry tickers to dark tactical styling values inside `src/features/map/MapControls.tsx` and `src/features/map/LiveRideMap.tsx`.
- [ ] 2.2 Initialize immediate geolocation position query on map mount inside `src/features/map/LiveRideMap.tsx` and sync coordinate details back to Zustand store.

## 3. Sub-page Navigation & Mobile Dynamic Scaling

- [ ] 3.1 Refactor click handlers for sub-nav tabs inside `src/features/views/DesktopView.tsx` to set activeView correctly.
- [ ] 3.2 Transition Group Sync, Helmet QR, and Ride History modals into full-screen inline pages in `src/features/views/DesktopView.tsx` and `src/features/views/MobileView.tsx`.
- [ ] 3.3 Apply dynamic fluid scaling constraints and container arrangement adjustments on smaller viewports.

## 4. Cloudflare KV Caching System

- [ ] 4.1 Implement Cache-Aside wrapper functions (reads with fallback to database, writes with invalidate) inside backend API/worker files.
- [ ] 4.2 Configure cache-keys namespacing using UUID tags and explicit TTL limits for public and authenticated routes.
- [ ] 4.3 Wrap all cache interactions in safe fail-open try/catch statements.

## 5. Verification

- [ ] 5.1 Install playwright packages and implement E2E tests: `scratchpad/test-master.ts` (master sequential run) and feature scripts (e.g. `scratchpad/test-map.ts`, `scratchpad/test-profile.ts`) checking all elements, using Playwright low-resource flags (`--disable-gpu`, `--no-sandbox`, `--disable-dev-shm-usage`), modern locators, and native assertions with 5 verification scenarios per element.
- [ ] 5.2 Run pre-commit checks and verify TypeScript type safety.
