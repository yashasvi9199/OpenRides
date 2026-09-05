## Purpose

Provides reliable, multi-layer live ride map rendering with robust tile loading, accurate layer switching controls, and clean unseeded initial session state.

## ADDED Requirements

### Requirement: Multi-Layer Map Tile Rendering
The system SHALL render complete map tiles across all supported layer types (OpenStreetMap raster, Positron Light, Dark, Satellite, and Terrain) without leaving a blank canvas or empty white card.

#### Scenario: User views default map
- **WHEN** user opens the live ride view
- **THEN** map tiles render immediately around the user's coordinates with visible geography, streets, and terrain rather than an empty white background

#### Scenario: User switches map layers
- **WHEN** user selects a different layer (Dark, Positron Light, Satellite, Terrain, or OSM) from the map layer control
- **THEN** the map immediately updates its tile style to the chosen layer without throwing uncaught errors or resetting viewport state

### Requirement: Map Worker and Tile Fallback Resilience
The system SHALL reliably initialize the map rendering engine and web worker, and provide automatic fallback to standard OpenStreetMap raster tiles if remote vector styles fail to load.

#### Scenario: Remote vector tile style fails or is blocked
- **WHEN** a third-party vector tile style server is unreachable or blocked
- **THEN** the map catches the style load error and switches to a local raster OpenStreetMap tile definition without breaking user pins or overlays

### Requirement: Clean Session State Without Active Dummy Records
The system SHALL comment out pre-configured dummy session records (mock riders, dummy host bike and session codes) in the active ride store so the live map displays only real GPS pins and active session members.

#### Scenario: Initial session initialization
- **WHEN** user launches or creates a new ride session
- **THEN** no mock phantom riders appear on the map or participant list, while mock definitions remain commented out in code for developer reference

### Requirement: Responsive Viewport and Pin Centering
The system SHALL ensure the map canvas resizes to fit its card container and smoothly pans/zooms to center on the rider's current coordinates when requested.

#### Scenario: Recenter button click
- **WHEN** user clicks the location recenter button on the map controls
- **THEN** the map pans smoothly to center the viewport precisely on the rider's current GPS pin
