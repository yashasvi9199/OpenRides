## Context

The application is currently locked to a dark Slate palette and uses the 2D Leaflet library which is not optimized for hardware acceleration or advanced 3D visual features like terrain elevation and search overlays. Also, mock data makes it hard to test clean start-up states. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Implement a global light theme by updating styles and body class wrappers.
- Swap Leaflet map with a custom programmatically initialized `MapLibre GL` map component.
- Clear initial mock values from stores (`rideStore.ts`, `authStore.ts`).
- Integrate OSRM routing and Photon search overlay layers on the map.

**Non-Goals:**
- Rewriting backend workers or database tables.
- Modifying security authentication protocols.

## Decisions

### 1. Light Theme Palette Transition
We will remove `class="dark"` from `index.html`, and update variables and classes in `index.css` and features views styles (`auth.styles.css`, `ride.styles.css`) to map slate-50/100 and light neutral backgrounds.

*Rationale:* Simplest path to transition standard Tailwind themes to a fresh light look.

### 2. MapLibre GL Integration & Terrain Engine
We will load `maplibre-gl` as a direct canvas renderer in `LiveRideMap.tsx`. We will load open-source styles (OpenFreeMap dark, ESRI Satellite, and AWS Terrarium elevation tiles).

*Rationale:* Provides vector-based 3D capabilities with zero API key dependencies.

### 3. Photon Search & OSRM Routing
We will fetch location data from `photon.komoot.io` and routing geojson coordinates from `router.project-osrm.org/route/v1/driving/` programmatically using standard fetch and update the map layers dynamically.

*Rationale:* Free, open-source APIs that do not require credentials.

## Risks / Trade-offs

- [Risk] Performance issues on low-end mobile devices when 3D elevation is exaggeration: 1.5.
  - *Mitigation:* Allow toggling terrain off, fallback to 2D rendering mode by default.
