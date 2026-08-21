## Purpose

Provides fully fluid, responsive layouts with separate Mobile and Desktop views using CSS clamp properties for dynamic scaling of all visual components.

## ADDED Requirements

### Requirement: Distinct Mobile and Desktop Layouts
The system SHALL detect the viewport size and render distinct Mobile and Desktop layouts tailored for each viewport class.

#### Scenario: Desktop viewport detection
- **WHEN** the viewport width is 640px or wider
- **THEN** the application SHALL render the Desktop view component

#### Scenario: Mobile viewport detection
- **WHEN** the viewport width is less than 640px
- **THEN** the application SHALL render the Mobile view component

### Requirement: CSS Clamp-based Fluid Sizing
The layout and typography SHALL use CSS `clamp()` functions to dynamically scale margins, paddings, and font sizes based on viewport size.

#### Scenario: Responsive Font Scaling
- **WHEN** viewport changes size dynamically
- **THEN** text element font-sizes SHALL scale linearly and remain within bounds defined by `clamp()` properties without static breakpoints or hardcoded layouts.
