## Why

The application currently defaults to a dark theme which is hardcoded across components, and initialized with extensive static mock data inside state stores (`rideStore.ts` and `authStore.ts`). Additionally, the current 2D Leaflet raster mapping engine is resource-limited and lacks high-tech 3D terrain/elevation, auto-rotating inertia controls, route planning/checkpoints, and direct location search.

## What Changes

- Transition the user interface from dark mode to a light theme natively by updating HTML/CSS classes and layout colours.
- Remove all dummy/mock participants, history logs, and pending join requests from state stores, ensuring a fresh initialization.
- Upgrade the 2D Leaflet mapping library to modern, hardware-accelerated 3D WebGL via MapLibre GL.
- Add style toggle switcher (Cyber Dark style, Satellite, 3D Terrain DEM).
- Integrate free Photon API search autocomplete overlaying the map header.
- Allow checkpoint additions and OSRM route geometry fetching/rendering.

## Capabilities

### New Capabilities

- `ui/light-theme`: Implementation of native light mode.
- `map/3d-maplibre`: Programmatic WebGL MapLibre GL map component with 3D elevation, OSRM route lines, and Photon location search.

### Modified Capabilities

## Impact

- `index.html`
- `src/App.tsx`
- `src/features/views/DesktopView.tsx`
- `src/features/views/MobileView.tsx`
- `src/features/map/LiveRideMap.tsx`
- `src/features/map/MapLayers.ts`
- `src/features/map/MapControls.tsx`
- `src/features/ride/rideStore.ts`
- `src/features/auth/authStore.ts`
- `package.json`
