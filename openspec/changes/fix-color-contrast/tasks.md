## 1. Shared Components Contrast Standardization

- [x] 1.1 Update `StatBadge.tsx` palette with high-contrast light-theme background tints (`bg-*-50`), distinct borders, `text-slate-900` values, and `text-slate-600`/`text-slate-700` labels/units.
- [x] 1.2 Update `Button.tsx` variant styles ensuring `outline` and `ghost` use `text-slate-700` and high-contrast hover states, and ensuring `variant="primary"` enforces `text-slate-950 font-bold`.
- [x] 1.3 Remove conflicting `text-white` overrides on `variant="primary"` buttons across views (`DesktopView.tsx`, `RideController.tsx`, `MedicalProfileEditor.tsx`, `GroupRideModal.tsx`, `EmergencyQRModal.tsx`).
- [x] 1.4 Update `Toast.tsx` icon and badge colors from `-400` to `-600` for clear contrast against white surfaces.
- [x] 1.5 Update `BottomNav.tsx` inactive label contrast from `text-slate-500` to `text-slate-600` and active indicators to `text-cyan-700`.

## 2. Live Cockpit & Map Overlays Contrast Fixes

- [ ] 2.1 Refactor speedometer typography in `LiveTelemetryOverlay.tsx` to replace camouflaged `text-white` with high-contrast `text-slate-900` on the cockpit glass card.
- [ ] 2.2 Update gauge circular background track, unit label (`KM/H`), and lean angle indicator pill in `LiveTelemetryOverlay.tsx` to high-contrast styling.
- [ ] 2.3 Refactor `RideController.tsx` secondary buttons and history buttons to use high-contrast text and icon colors.
- [ ] 2.4 Update `MapControls.tsx` muted text (`text-slate-500` "Data Store Sync") to high-contrast `text-slate-300` and ensure all control icons remain crisp against `bg-slate-900/95`.
- [ ] 2.5 Audit and fix search input placeholder and toggle button text in `LiveRideMap.tsx`.

## 3. Family Dashboard, Group Roster & Modals

- [ ] 3.1 Fix `FamilyDashboard.tsx` highlight card typography by replacing `text-white`, `text-slate-300`, and `text-slate-200` with `text-slate-900`, `text-slate-700`, and `text-slate-800`.
- [ ] 3.2 Refactor `GroupRidersList.tsx` container header and rider row items from translucent dark mode (`bg-slate-800/40`, `text-slate-100`) to crisp light cards (`bg-slate-50`, `border-slate-200`, `text-slate-900`).
- [ ] 3.3 Update `GroupRiderApprovalModal.tsx` modal title from `text-cyan-400` to `text-cyan-700` and replace dark body box with high-contrast light dialog styling.
- [ ] 3.4 Update `GroupRideModal.tsx` tabs, secret ride code badge, and simulation panel typography to eliminate low-contrast labels.
- [ ] 3.5 Update `RideHistoryModal.tsx` modal title from `text-cyan-400` to `text-cyan-700` and ensure history metrics have strong contrast against card backgrounds.
- [ ] 3.6 Refactor `MedicalProfileEditor.tsx` section headings, form labels, and tag pills to enforce high-contrast slate text.

## 4. Verification & Contrast Validation

- [ ] 4.1 Run TypeScript type check (`pnpm run build` or `pnpm tsc --noEmit`) to verify zero type regressions.
- [ ] 4.2 Validate contrast ratios across all modified components against WCAG AA standards (>= 4.5:1 for regular text, >= 3:1 for large text).
