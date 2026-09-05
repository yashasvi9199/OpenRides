## Why

Currently, when viewing the live ride map, users see only an isolated user pin and a blank white card instead of functional map tiles. This failure stems from several compounding issues:
1. MapLibre GL worker initialization conflicts caused by custom inline worker overrides in Vite.
2. Layer key mismatches between `MapControls.tsx` (which requests `'osm'`) and `MAP_LAYERS` in `MapLayers.ts` (which does not define `'osm'`), leading to undefined layer lookups and style loading failures.
3. Unreliable or blocked external vector tile URLs lacking raster fallbacks.
4. Dummy session entries and mock riders active by default in the ride store, cluttering state when testing live GPS tracking.

Fixing these issues ensures the map renders immediately, supports all layer switches (Positron, Dark, Satellite, Terrain, OSM), and starts with clean commented-out mock state.

## What Changes

- **MapLibre Worker & Rendering**: Correct the MapLibre GL worker provider configuration to ensure vector and raster tiles parse and render seamlessly in both dev and production builds.
- **Layer Harmonization**: Align layer identifiers across `MapLayers.ts`, `MapControls.tsx`, and `LiveRideMap.tsx`. Add explicit support for `osm` (OpenStreetMap standard raster), `positron`, `dark`, `satellite`, and `terrain`.
- **Tile Fallback Resilience**: Provide verified, working raster and vector tile sources with fallback handling so network or CORS issues on one provider do not leave a blank white card.
- **Dummy Entries Commented Out**: Comment out dummy host/participant records and simulation mock riders in `rideStore.ts` and related simulation hooks so the app initializes with a clean, authentic state while keeping mock templates preserved for future testing.
- **Map Container & Canvas Sizing**: Ensure map viewport resize listeners and container styling prevent collapsed canvas bounds.

## Capabilities

### New Capabilities
- `map/live-map-rendering`: Reliable multi-layer map rendering, synchronized layer controls, tile fallback support, and clean initial ride state without active dummy entries.

### Modified Capabilities

## Impact

- `src/features/map/LiveRideMap.tsx`: Worker setup, map style loading, layer switching, resize handling.
- `src/features/map/MapLayers.ts`: Layer configuration definitions and tile source URLs.
- `src/features/map/MapControls.tsx`: Layer toggle actions and active state badges.
- `src/features/map/map.types.ts`: Map layer type definitions.
- `src/features/ride/rideStore.ts`: Comment out dummy initial participants and default mock session data.
