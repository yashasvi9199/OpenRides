## Context

See proposal.md - Why. Current geolocation tracker fetches GPS coordinates using raw `getCurrentPosition` calls without accuracy filtering gates or mathematical coordinate smoothing filters. Additionally, MapLibre styles switch options between Vector (Cyber Dark / Positron Light) and XYZ Raster Satellite do not configure correct source tiles parameters.

## Goals / Non-Goals

**Goals:**
- Configure navigator geolocator options with high accuracy, zero cache age, and short timeout.
- Implement client-side GPS accuracy verification gating (>25m discard rule).
- Integrate 1D Kalman filter calculations (State Estimate, Covariance updates) to smooth location coordinate coordinates before updates.
- Render maps with 45-degree initial camera pitch, custom bearing camera rotation, and toggles for Carto Dark Matter GL vs ESRI Satellite raster.

**Non-Goals:**
- Offline route generation routing.
- MapLibre GL worker service cache headers changes.

## Decisions

### 1D Kalman Filter Integration
- **Decision**: Program a native lightweight single-dimension Kalman filter utility in `src/shared/utils/kalman.ts` instead of installing external libraries.
- **Alternatives Considered**: Using `rob Kalman` npm modules, but standalone 1D calculations for latitude and longitude separately reduce memory footprints.

### Carto Dark Matter GL Style
- **Decision**: Set MapLibre default vector style to Carto Dark Matter GL style JSON config (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`).
- **Alternatives Considered**: ESRI Vector style, but Carto basemaps are 100% open source and require no developer registration key.

## Risks / Trade-offs

- [Risk] Kalman filter lag on sudden movement changes → Mitigation: Adjust filter measurement noise covariance parameters to react quickly to rapid velocities.
