## 1. Map Canvas Upgrades

- [x] 1.1 Update `src/features/map/MapLayers.ts` config to use Carto Dark Matter GL as the primary vector layer url
- [x] 1.2 Enable 45-degree angle pitch on MapLibre initialization in `src/features/map/LiveRideMap.tsx`
- [x] 1.3 Add top-right overlay layer toggle buttons supporting swap to ESRI Satellite raster tiles source in `src/features/map/MapControls.tsx`

## 2. Telemetry and Kalman Smoothing Filter

- [x] 2.1 Set location tracker configuration variables (`enableHighAccuracy: true`, `maximumAge: 0`, `timeout: 15000`)
- [x] 2.2 Add coordinate accuracy threshold check logic to ignore inputs where `accuracy > 25` meters
- [x] 2.3 Program 1D Kalman filter math logic class in `src/shared/utils/kalman.ts`
- [x] 2.4 Hook Kalman filtering middleware into store coordinates updater updates
