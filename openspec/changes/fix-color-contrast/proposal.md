## Why

Following the light theme migration, several key screens, telemetry monitors, dialogs, cards, labels, and titles suffer from broken color contrast where white or light-slate typography (`text-white`, `text-slate-100`, `text-slate-200`, `text-slate-300`, `text-cyan-400`) renders on white or light backgrounds (`bg-white`, `bg-slate-50`, `bg-slate-100`), making critical metrics like speedometer readouts, family dashboard titles, group rosters, and modal content completely invisible or camouflaged. In addition, tactical dark overlays (such as map controls) use low-contrast muted text (`text-slate-500` on `bg-slate-900`), and buttons with cyan backgrounds use white text that fails WCAG AA standards (2.97:1). Fixing this immediately restores legibility, safety observability, and WCAG AA compliance across the entire application.

## What Changes

- **Live Telemetry & Cockpit Overlay**: Fix speedometer value text and digital readout contrast in `LiveTelemetryOverlay.tsx` by replacing camouflaging `text-white` on glass/light cards with deep high-contrast slate (`text-slate-900`), and updating gauge tracks and lean-angle pill indicators to maintain high readability.
- **Family Dashboard**: Resolve invisible rider title (`text-white` on white highlight card) and muted subtitle text (`text-slate-300`, `text-slate-200`) in `FamilyDashboard.tsx` to high-contrast `text-slate-900` and `text-slate-700`.
- **Active Group Roster**: Fix active roster title (`text-slate-100` on white card) and participant item rows in `GroupRidersList.tsx`, replacing pale dark-mode pills and faint text with crisp, high-contrast light card styling.
- **Telemetry Badges (`StatBadge`)**: Redesign `StatBadge.tsx` variants to use accessible high-contrast color pairings (e.g. solid slate values `text-slate-900`, high-contrast labels `text-slate-600`/`text-slate-700`, clear unit indicators, and vibrant yet legible badge accents) that render with strong contrast on both white and light-slate surfaces.
- **Buttons (`Button.tsx`) & Overrides**: Fix `outline` and `ghost` button variants in `Button.tsx` which currently use `text-slate-200` and `text-slate-300` on light backgrounds. Remove conflicting `text-white` overrides on `variant="primary"` buttons (`bg-cyan-500`) to ensure all primary buttons use high-contrast `text-slate-950` (9.8:1 contrast ratio) instead of low-contrast white text (2.97:1).
- **Modals & Dialogs**: Correct modal headers, subtitle text, and form labels in `GroupRideModal.tsx`, `GroupRiderApprovalModal.tsx`, `EmergencyQRModal.tsx`, and `RideHistoryModal.tsx`, replacing low-contrast cyan (`text-cyan-400` on white headers) with dark cyan (`text-cyan-700`) and fixing muted labels and translucent dark boxes.
- **Tactical Map Controls**: Upgrade muted labels in `MapControls.tsx` (e.g. `text-slate-500` on `bg-slate-900`) to crisp `text-slate-400`/`text-slate-300` with high-contrast accent highlights.
- **Toast Notifications**: Elevate icon and text contrast in `Toast.tsx` so notification icons and descriptions meet WCAG AA standards against white backgrounds.

## Capabilities

### New Capabilities
- `ui/accessible-contrast`: Comprehensive color contrast, typography hierarchy, card, label, and section background fixes ensuring WCAG AA (>= 4.5:1 for normal text, >= 3:1 for large text) readability across all rider, family, map, and modal views.

### Modified Capabilities
None.

## Impact

- `src/features/ride/LiveTelemetryOverlay.tsx`
- `src/features/auth/FamilyDashboard.tsx`
- `src/features/ride/GroupRidersList.tsx`
- `src/features/ride/GroupRiderApprovalModal.tsx`
- `src/features/ride/GroupRideModal.tsx`
- `src/features/ride/RideHistoryModal.tsx`
- `src/features/ride/RideController.tsx`
- `src/features/sos/MedicalProfileEditor.tsx`
- `src/features/sos/EmergencyQRModal.tsx`
- `src/features/map/MapControls.tsx`
- `src/features/map/LiveRideMap.tsx`
- `src/shared/components/Card.tsx`
- `src/shared/components/Button.tsx`
- `src/shared/components/StatBadge.tsx`
- `src/shared/components/Toast.tsx`
- `src/shared/components/BottomNav.tsx`
