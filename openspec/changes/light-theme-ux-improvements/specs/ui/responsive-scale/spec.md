## Purpose

Defines requirements for inline page subviews and responsive scaling on small screen sizes.

## ADDED Requirements

### Requirement: Full-Screen Subpages
The application SHALL render Group Sync, Helmet QR sticker, and History Logs features as full-screen pages/views instead of modal overlay popups.

#### Scenario: Verify sub-nav page transitions
- **WHEN** sub-nav buttons are clicked
- **THEN** the active view SHALL transition the screen to render that subview directly as a full page rather than opening a modal popup

### Requirement: Dynamic Layout Adaptation
The layout components, fonts, grids, and buttons SHALL scale dynamically based on viewport dimensions.

#### Scenario: Verify layout scaling on small viewports
- **WHEN** rendering on smaller mobile screen dimensions
- **THEN** spacing, font clamp sizes, and grid parameters SHALL automatically reduce to prevent clipping
