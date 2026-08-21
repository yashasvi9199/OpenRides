## 1. Vite & Styles Optimization

- [ ] 1.1 Exclude `maplibre-gl` from Vite dependency optimization in `vite.config.ts`.
- [ ] 1.2 Remove Leaflet stylesheet link from `index.html`.
- [ ] 1.3 Update global font clamp ranges and container paddings inside `src/index.css`.

## 2. High-Contrast Overlay Controls & Map Geolocator

- [ ] 2.1 Revert map control overlay containers and telemetry tickers to dark tactical styling values inside `src/features/map/MapControls.tsx` and `src/features/map/LiveRideMap.tsx`.
- [ ] 2.2 Initialize immediate geolocation position query on map mount inside `src/features/map/LiveRideMap.tsx` and sync coordinate details back to Zustand store.

## 3. Sub-page Navigation & Mobile Dynamic Scaling

- [ ] 3.1 Refactor click handlers for sub-nav tabs inside `src/features/views/DesktopView.tsx` to set activeView correctly.
- [ ] 3.2 Transition Group Sync, Helmet QR, and Ride History modals into full-screen inline pages in `src/features/views/DesktopView.tsx` and `src/features/views/MobileView.tsx`.
- [ ] 3.3 Apply dynamic fluid scaling constraints and container arrangement adjustments on smaller viewports.

## 4. Verification

- [ ] 4.1 Update E2E test assertions to verify geolocator calls and inline pages.
- [ ] 4.2 Run pre-commit checks and verify TypeScript type safety.
