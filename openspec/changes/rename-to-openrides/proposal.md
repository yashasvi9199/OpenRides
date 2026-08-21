## Why

The application currently refers to the legacy name "MotoGuard" in several user-facing UI elements, meta-tags, configuration identifiers, and storage keys. We need to rename all occurrences of "MotoGuard" to "OpenRides" to align with the branding of the project.

## What Changes

- Update application title, meta tags, and open-graph properties to "OpenRides".
- Rename UI display text, alerts, and PDF header strings.
- Rename schema and config file metadata names to OpenRides.
- Rename internal keys, schemes (e.g. `motoguard://` -> `openrides://`), and email references.

## Capabilities

### New Capabilities

- `branding/app-rename`: Complete application renaming from MotoGuard to OpenRides.

### Modified Capabilities

## Impact

- `index.html`
- `metadata.json`
- `src/shared/components/Navbar.tsx`
- `src/features/sos/pdfExport.ts`
- `src/features/sos/EmergencyQRModal.tsx`
- `src/features/auth/authStore.ts`
- `src/features/ride/GroupRideModal.tsx`
