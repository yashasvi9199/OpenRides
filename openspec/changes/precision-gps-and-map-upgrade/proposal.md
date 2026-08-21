## Why

The current map component displays inaccurate location readings and does not render high-contrast vector layers properly on all environments. Since OpenRides is designed for rider safety and emergency response tracking, it is vital that telemetry markers utilize sub-meter precision GPS gating with Kalman filters to discard false coordinates jumps, smooth coordinate jitter, and support dynamic map layer toggling of vector style tiles.

## What Changes

- Modify map initialization settings to force high-contrast 3D vector styles (`Carto Dark Matter GL` or `OpenFreeMap Dark`) by default with initial `pitch: 45` camera tilting.
- Add map controls for top-right layout layer switching between Vector Dark and ESRI Satellite tiles.
- Configure Web Geolocation API parameters with strict options (`enableHighAccuracy: true`, `maximumAge: 0`, `timeout: 15000`).
- Discard/ignore GPS updates where accuracy reports values higher than 25 meters.
- Introduce a 1D Kalman filter to smooth out coordinate readings before committing to SQLite queue and map markers.

## Capabilities

### New Capabilities
- `map/precision-tracker`: Sub-meter GPS accuracy gating, coordinate jitter Kalman filter, and 3D vector styles layer toggling.

### Modified Capabilities

## Impact

- `src/features/map/LiveRideMap.tsx`: Initialization props, styles toggles, camera view coordinates adjustments.
- `src/features/map/MapLayers.ts`: Style URLs configuration and configuration sources.
- Geolocation tracking logic.
