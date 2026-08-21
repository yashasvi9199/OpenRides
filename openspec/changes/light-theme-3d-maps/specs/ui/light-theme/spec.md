## Purpose

Defines requirements for native light mode user interface and removal of all static dummy/mock data from store state slices.

## ADDED Requirements

### Requirement: Light Mode Default Styling
The application SHALL default to a light theme presentation natively across all viewports and panels.

#### Scenario: Verify main body styles
- **WHEN** the application is loaded
- **THEN** the main background style SHALL render in light/neutral shades instead of dark slate

### Requirement: Zero Dummy Data Initialization
The state stores SHALL initialize with empty lists or empty states for telemetry tracks, session participants, historical logs, and pending requests.

#### Scenario: Verify initial stores state
- **WHEN** the Zustand auth and ride stores are instantiated
- **THEN** the participants list (excluding host), history list, and pending join requests list SHALL be empty
