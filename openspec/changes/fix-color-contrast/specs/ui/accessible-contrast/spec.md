## Purpose

Establishes accessible high-contrast visual standards across all typography, panels, cards, badges, dialogs, and controls to guarantee WCAG AA legibility and eliminate text camouflage.

## ADDED Requirements

### Requirement: Cockpit Telemetry Speedometer Contrast
The live telemetry speedometer readout, unit labels, and lean indicators SHALL render with high contrast (WCAG AA ratio >= 4.5:1 for regular text, >= 3:1 for large display text) against both light glass cards and dark tactical containers, and MUST NOT display white text against light card backgrounds.

#### Scenario: Rider views live cockpit speedometer on light theme
- **WHEN** the rider views the live telemetry overlay cockpit
- **THEN** the speed numerical value displays in dark high-contrast typography (`text-slate-900`) clearly legible against the glass card background
- **THEN** the KM/H unit subtitle and lean angle indicator display with distinct dark borders and text with contrast ratio exceeding 4.5:1

### Requirement: Family Dashboard Readout and Header Contrast
The Family Guardian Dashboard SHALL display monitoring rider headers, motorcycle license details, and status banners in high-contrast text against card backgrounds, avoiding white text on white or light-cyan cards.

#### Scenario: Guardian monitors active rider
- **WHEN** the user switches to the Family role
- **THEN** the "Monitoring Rider" title is rendered in high-contrast dark text (`text-slate-900`) on the highlight card
- **THEN** the motorcycle details, last sync timestamp, and status message are rendered in high-contrast slate text (`text-slate-700` and `text-slate-800`)

### Requirement: Group Roster and Participant List Visibility
The active group roster container and participant items SHALL render using light theme card borders and dark typography rather than translucent dark-mode backgrounds with low-contrast muted text.

#### Scenario: Host views synced riders in group roster
- **WHEN** the host views the active group roster card
- **THEN** the roster header displays in high-contrast dark text (`text-slate-900`)
- **THEN** each participant row displays rider names and vehicle details in dark slate (`text-slate-900` and `text-slate-700`) with legible telemetry metrics

### Requirement: Telemetry StatBadge High-Contrast Palette
All StatBadge variants (`cyan`, `amber`, `emerald`, `red`, `slate`) SHALL render metric values, labels, units, and subtexts using high-contrast color combinations that remain legible (contrast >= 4.5:1) against both default white cards and light-slate page backgrounds.

#### Scenario: Rider observes telemetry stat badges
- **WHEN** the rider reviews trip distance, ride time, peak speed, or battery stat badges
- **THEN** the metric value is rendered in deep solid dark text (`text-slate-900`)
- **THEN** the label and unit text are rendered in high-contrast slate (`text-slate-600` or `text-slate-700`)
- **THEN** the background tint and border provide a distinctive accessible colored accent without obscuring text

### Requirement: Button High-Contrast Styling and Overrides
Primary, outline, and ghost action buttons SHALL adhere to WCAG AA contrast standards. Specifically, primary buttons (`bg-cyan-500`) SHALL render text in `text-slate-950` (contrast ratio 9.8:1) and SHALL NOT use `text-white` (contrast ratio 2.97:1). Ghost and outline buttons SHALL use dark text (`text-slate-700` or `text-slate-800`) on light backgrounds.

#### Scenario: User views and hovers action buttons
- **WHEN** the user interacts with primary action buttons across the app
- **THEN** the button text is rendered in deep dark slate (`text-slate-950`) providing at least 9:1 contrast against the cyan background
- **THEN** outline and ghost buttons display text in high-contrast slate (`text-slate-700` or `text-slate-800`) clearly visible against white surfaces

### Requirement: Modal and Dialog Header and Label Contrast
All dialog headers, code display cards, form labels, and simulated action panels inside modals (Group Ride Sync, Helmet QR Sticker, Rider Approval, and Ride History) SHALL display headers in dark cyan (`text-cyan-700` or darker) or dark slate (`text-slate-900`) and all labels in dark high-contrast typography.

#### Scenario: User opens Group Sync or History dialog
- **WHEN** the user opens the Group Sync or Ride History modal
- **THEN** the modal title icon and text are rendered in dark high-contrast colors (`text-cyan-700` or `text-slate-900`)
- **THEN** secret ride code digits, instruction copy, and table cells are rendered in high-contrast typography with contrast ratio >= 4.5:1

### Requirement: Map Overlay Controls Readability
Overlay controls, data sync indicators, and layer selection buttons on the map SHALL maintain sharp contrast against dark tactical backdrops (`bg-slate-900/95`), upgrading low-contrast muted labels to crisp legible text with at least 4.5:1 contrast.

#### Scenario: User inspects map controls overlay
- **WHEN** the user views the MapControls panel on the live map
- **THEN** the "Data Store Sync" label is rendered in legible `text-slate-300` or `text-slate-400`
- **THEN** all control button icons and active state highlights remain clearly visible against the dark backdrop
