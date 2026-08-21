## 1. Static Metadata & HTML Config Updates

- [x] 1.1 Update application name strings in HTML title, description, and open-graph properties in `index.html`.
- [x] 1.2 Update application metadata name in `metadata.json`.

## 2. Components & PDF Exporter Rebranding

- [x] 2.1 Update text references of MotoGuard to OpenRides in shared components, views, and modal descriptions (`src/shared/components/Navbar.tsx`, `src/features/ride/GroupRideModal.tsx`, `src/features/sos/EmergencyQRModal.tsx`).
- [x] 2.2 Update PDF title, headers, and output filename in `src/features/sos/pdfExport.ts` to reflect OpenRides.

## 3. Store, Keys, and Storage Transition

- [x] 3.1 Update Zustand `authStore.ts` keys, fallback local storage loaders, and user email schema bindings to use openrides.

## 4. Verification

- [x] 4.1 Update scratchpad E2E test file to match the new OpenRides page title.
- [ ] 4.2 Run pre-commit build checks and verify TypeScript type safety.
