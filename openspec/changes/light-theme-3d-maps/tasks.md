## 1. Clean Initialization & Store Cleanup

- [x] 1.1 Remove dummy participants and initial history lists from `src/features/ride/rideStore.ts`.
- [x] 1.2 Clear mock profile default values from `src/features/auth/authStore.ts`.

## 2. Light Theme Integration

- [x] 2.1 Update `index.html` body and html element classes to use light mode.
- [x] 2.2 Refactor layout classes in `DesktopView.tsx` and `MobileView.tsx` to transition background Slate shades from dark to light.
- [x] 2.3 Refactor styling variables and borders in `src/index.css` and features styles to light mode.

## 3. MapLibre GL 3D Map Implementation

- [ ] 3.1 Install maplibre-gl and @types/maplibre-gl.
- [ ] 3.2 Implement MapLibre GL rendering canvas inside `LiveRideMap.tsx`, handling map cleanup.
- [ ] 3.3 Add Base Style Switcher supporting Cyber Dark, Satellite, and 3D Elevation Terrain.
- [ ] 3.4 Enable 3D pitch and bearing camera rotation with smooth inertia.
- [ ] 3.5 Implement autocomplete search input bar floating over map header querying Photon API.
- [ ] 3.6 Support checkpoint selection on tap, query route geometry via OSRM, and draw cyan route path on canvas.
- [ ] 3.7 Render custom markers for host and approved group members.

## 4. Verification

- [ ] 4.1 Update E2E test file to verify light mode styles and MapLibre canvas elements.
- [ ] 4.2 Run pre-commit checks and verify TypeScript type safety.
