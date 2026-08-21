## Why

The recent light theme migration resulted in insufficient color contrast in several headers, text fields, and map control buttons. The MapLibre engine style files fail to load properly due to Vite dependency optimization conflicts, and the dynamically loaded `maplibre-gl-worker.mjs` fails on remote deployments with `NS_ERROR_CORRUPTED_CONTENT` caching errors. The map does not center on the user's initial GPS location on mount. The Medical I.C.E. button triggers a toast instead of showing the page. Modals like Group Sync, QR Sticker, and History Logs need to be rendered inline as full-screen views rather than overlay popups. View components are not dynamically scaling on smaller mobile viewports. Existing E2E testing scripts use high-resource Puppeteer sandboxes, which need to be migrated to lightweight headless Playwright testing with automatic actionability.

## What Changes

- Add high-contrast text and border variables for light mode and transition map controls to a dark tactical styling theme.
- Add `maplibre-gl` worker to `optimizeDeps.exclude` in `vite.config.ts`.
- Inline the `maplibre-gl` web worker using Vite's `?worker&inline` asset helper queries to prevent remote cached loading failures.
- Initialize initial geolocation tracking on mount inside `LiveRideMap.tsx` and sync coordinates back to the store.
- Fix the click handlers in `DesktopView.tsx` and `MobileView.tsx` to set activeView state and show views directly.
- Refactor modals to inline full-screen page views controlled by `activeView`.
- Apply fluid clamp scaling, dvh heights, and grid layouts to keep mobile panels fit on the screen without overflow.
- Migrate E2E testing from Puppeteer to Playwright with low-resource flags (`--disable-gpu`, `--no-sandbox`, `--disable-dev-shm-usage`) and modern locator/assertion checks.

## Capabilities

### New Capabilities

- `ui/responsive-scale`: Responsive mobile dynamic scaling and inline views.

### Modified Capabilities

- `ui/light-theme`: High-contrast styling revisions.
- `map/3d-maplibre`: MapLibre optimization exclusions, high-contrast controls, and geolocate initializations.

## Impact

- `vite.config.ts`
- `src/features/views/DesktopView.tsx`
- `src/features/views/MobileView.tsx`
- `src/features/map/LiveRideMap.tsx`
- `src/features/map/MapControls.tsx`
- `src/features/auth/authStore.ts`
- `src/index.css`
- `index.html`
- `scratchpad/test-ui.ts`
