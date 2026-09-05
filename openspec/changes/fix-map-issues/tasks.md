## 1. Map Types and Layer Harmonization

- [x] 1.1 Update `MapLayerId` type in `src/features/map/map.types.ts` to cleanly support `'osm' | 'positron' | 'dark' | 'satellite' | 'terrain'`
- [x] 1.2 Standardize `MAP_LAYERS` in `src/features/map/MapLayers.ts` with verified raster/vector style endpoints and OpenStreetMap fallback
- [x] 1.3 Align `MapControls.tsx` layer toggle options, active state badges, and layer IDs with `MAP_LAYERS`

## 2. LiveRideMap Worker and Rendering Engine

- [x] 2.1 Refactor MapLibre web worker configuration in `src/features/map/LiveRideMap.tsx` to prevent inline worker initialization crashes
- [x] 2.2 Implement style load error boundary with fallback to OSM raster tiles in `LiveRideMap.tsx`
- [x] 2.3 Optimize map container layout, canvas resize listeners, and GPS pin centering

## 3. Clean Mock Data and Dummy Entries

- [x] 3.1 Comment out dummy participants and mock host bike/code defaults in `src/features/ride/rideStore.ts`
- [x] 3.2 Comment out simulated mock riders in `src/features/ride/GroupRideModal.tsx` while preserving structure as comments

## 4. Verification and Quality Checks

- [x] 4.1 Run `tsc --noEmit` to verify type safety across map and ride stores
- [x] 4.2 Run `pnpm run build` to confirm production build compatibility
- [x] 4.3 Validate map rendering and layer switching in the browser
