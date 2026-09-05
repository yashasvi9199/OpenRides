## Context

See `proposal.md - Why`. During the migration to a modern light theme, the root application and cards were switched to `bg-slate-50` and `bg-white`, but multiple components retained dark-mode typography tokens (`text-white`, `text-slate-100`, `text-slate-200`, `text-slate-300`, `text-cyan-400`, `bg-slate-800/40`). When rendered inside light-background card containers, text elements camouflage completely or fall far below WCAG AA accessibility contrast ratios.

Furthermore, several buttons with cyan backgrounds (`bg-cyan-500`) had explicit `text-white` class overrides applied, reducing the contrast ratio from an accessible 9.8:1 (`text-slate-950`) down to an inaccessible 2.97:1 (`text-white`).

## Goals / Non-Goals

**Goals:**
- Guarantee WCAG AA contrast compliance across all screens, cards, labels, fonts, and titles (>= 4.5:1 for normal text, >= 3:1 for large display text/icons).
- Completely eradicate white-on-white or pale-on-light camouflaged text (speedometer, family dashboard title, group roster list items, modal headers).
- Standardize light-theme typography tokens across all feature modules.
- Ensure dedicated dark overlays (such as `MapControls`, `CrashDetectionBanner`, and `PublicEmergencyView`) maintain high-contrast light text against their dark tactical containers.
- Align button variants (`primary`, `secondary`, `outline`, `ghost`) with accessible text color pairings.

**Non-Goals:**
- Adding dark/light toggle switches or dual-theme runtime state (the app standardizes on a high-contrast light aesthetic with tactical map overlays, per project constraints).
- Changing application layout, responsive breakpoints, or store logic.

## Decisions

### 1. Light Theme Typography Token System
- **Display & Main Titles**: `text-slate-900` (e.g. speedometer number, screen titles, family dashboard headers).
- **Card Subheadings & Section Titles**: `text-slate-800` with bold weights.
- **Primary Body & Rider Metadata**: `text-slate-700`.
- **Secondary Labels & Timestamps**: `text-slate-600` (replaces `text-slate-400` / `text-slate-500` which camouflaged on white).
- **Brand Accent Text on Light Surfaces**: `text-cyan-700` or `text-cyan-800` (replaces `text-cyan-400` which only has 1.74:1 contrast on white).

*Alternative considered:* Keeping `text-cyan-600`. While acceptable for large text, `text-cyan-700` achieves >= 5.2:1 contrast for small metadata text and labels.

### 2. StatBadge Color Palette & Structure
In `StatBadge.tsx`, telemetry cards render against white or light-slate backgrounds. We refactor the badge palette to:
- Numerical Value: `text-slate-900 font-mono font-black` (ensures 12:1+ contrast).
- Label: `text-slate-600 uppercase font-semibold text-[11px]`.
- Unit & Subtext: `text-slate-600` / `text-slate-700`.
- Badge Container: Light pastel tint with distinct border:
  - `cyan`: `bg-cyan-50 border-cyan-200 text-cyan-800`
  - `amber`: `bg-amber-50 border-amber-200 text-amber-800`
  - `emerald`: `bg-emerald-50 border-emerald-200 text-emerald-800`
  - `red`: `bg-red-50 border-red-200 text-red-800`
  - `slate`: `bg-slate-100 border-slate-200 text-slate-700`

*Alternative considered:* Leaving dark pill backgrounds (`bg-cyan-950/40`) with white text. This creates visual noise with muddy semi-transparent dark patches on clean light cards.

### 3. Primary Button and Variant Fixes
- `Button.tsx`: Ensure `variant="primary"` has `text-slate-950 font-bold` on `bg-cyan-500`. Remove all downstream `text-white` overrides.
- `variant="outline"`: Use `border-slate-300 text-slate-700 hover:border-cyan-600 hover:text-cyan-800 hover:bg-cyan-50/50`.
- `variant="ghost"`: Use `text-slate-700 hover:text-slate-950 hover:bg-slate-100`.

### 4. Group Roster and Modal Dialog Cards
- `GroupRidersList.tsx`: Replace `bg-slate-800/40` and `text-slate-100` with clean `bg-slate-50 border-slate-200 text-slate-900` for default riders, `bg-cyan-50 border-cyan-300 text-cyan-950` for host, and `bg-red-50 border-red-300 text-red-950` for SOS alert rows.
- `GroupRiderApprovalModal.tsx`: Replace dark container `bg-cyan-950/30` and `text-slate-100` with high-contrast light dialog styling (`bg-cyan-50 border-cyan-200 text-slate-900`).
- `RideHistoryModal.tsx`: Replace `text-cyan-400` in title with `text-cyan-700`.

### 5. Context-Specific Tactical Dark Overlays
Components intentionally designed as tactical dark overlays (`MapControls.tsx`, `CrashDetectionBanner.tsx`, `PublicEmergencyView.tsx`) maintain their dark surfaces (`bg-slate-900/95`, `bg-slate-950`), but all muted text inside them must use light high-contrast classes:
- Replace `text-slate-500` in `MapControls.tsx` with `text-slate-300` / `text-slate-200`.
- Ensure icon buttons on dark surfaces hover to `bg-slate-800 text-white`.

## Risks / Trade-offs

- **[Risk] Accidental contrast regression on dark emergency views** → **Mitigation**: Maintain explicit dark-theme typography exclusively within `PublicEmergencyView.tsx`, `CrashDetectionBanner.tsx`, and `MapControls.tsx`, while updating all dashboard, card, and modal files to the high-contrast light palette.
- **[Risk] Hover and active state regressions** → **Mitigation**: Verify hover, focus, and active states for all modified interactive buttons and links.
