## Context

See `proposal.md` for motivation and background. MapLibre GL is configured in `src/features/map/LiveRideMap.tsx`, layer definitions in `src/features/map/MapLayers.ts`, and layer switcher UI in `src/features/map/MapControls.tsx`. Currently, layer keys are desynchronized (e.g., `'osm'` requested by controls but absent in `MAP_LAYERS`), the MapLibre web worker is overridden using a brittle Vite inline worker provider, and mock/dummy participants populate `rideStore.ts` by default.

## Goals / Non-Goals

**Goals:**
- Guarantee immediate rendering of map tiles with no blank white canvas or stuck pin-only view.
- Provide dependable, CORS-friendly tile source definitions for all layers (`osm`, `positron`, `dark`, `satellite`, `terrain`).
- Harmonize layer IDs and typing across `map.types.ts`, `MapLayers.ts`, `MapControls.tsx`, and `LiveRideMap.tsx`.
- Comment out dummy initial entries in `rideStore.ts` and mock rider simulators, leaving clean commented templates.
- Implement runtime fallback to standard OpenStreetMap raster tiles if any tile style URL fails to load.

**Non-Goals:**
- Integrating proprietary paid map APIs (Mapbox, Google Maps API key requirements).
- Changing backend telemetry or WebRTC/WebSocket communication channels.

## Decisions

### 1. Robust MapLibre Worker Configuration
- **Decision**: Remove the brittle `(maplibregl.config as any).WORKER_PROVIDER` inline import pattern. Use MapLibre GL's standard asset loading or direct worker URL resolution compatible with Vite.
- **Rationale**: Vite's `?worker&inline` packaging causes worker instantiation errors in certain browser environments, halting tile parsing and leaving the canvas blank.
- **Alternative considered**: Bundling custom web workers manually; rejected because standard MapLibre worker defaults are already built and tested for ES module targets.

### 2. Standardized Tile Styles with Native Raster Fallbacks
- **Decision**: Define standard MapLibre-compliant style objects for raster layers (OpenStreetMap, Carto Voyager, Carto Dark Matter, ESRI World Imagery for Satellite, OpenTopoMap for Terrain).
- **Rationale**: Vector style endpoints like `tiles.openfreemap.org` occasionally block requests or require external glyph fonts that fail when loaded offline or in restrictive browser setups. Raster-based style specifications are 100% resilient and render instantly.
- **Alternative considered**: Relying purely on external style JSON URLs; rejected because network timeouts or schema shifts on remote hosts result in blank canvases.

### 3. Layer ID Alignment across Components
- **Decision**: Define `MapLayerId = 'osm' | 'positron' | 'dark' | 'satellite' | 'terrain'` in `map.types.ts`. Update `MAP_LAYERS` in `MapLayers.ts` to include `'osm'` (or alias Positron/OSM consistently) and align `MapControls.tsx`.
- **Rationale**: Resolves undefined lookups where `MAP_LAYERS['osm']` evaluated to undefined, causing invalid style assignments.

### 4. Commented-out Dummy Entries in Ride Store
- **Decision**: In `src/features/ride/rideStore.ts`, comment out mock host bike/name values and the mock participant array in `createInitialSession()`. Set initial `participants: []` and empty initial mock codes, while preserving commented code blocks for future development reference.
- **Rationale**: Direct compliance with user requirement to remove dummy entries while leaving them commented for future testing.

## Risks / Trade-offs

- **[Risk] External Tile Service Rate Limiting** → **Mitigation**: Use reputable public endpoints (OSM tile servers, CartoCDN, ESRI ArcGIS World Imagery) with appropriate attribution headers and fallback handlers.
- **[Risk] Resize / Container Collapse** → **Mitigation**: Add explicit resize observers and `map.resize()` invocations on mount and window changes.
