## Purpose

Defines requirements for the 3D MapLibre GL mapping engine component including search, OSRM routes, base style switcher, and terrain DEM.

## ADDED Requirements

### Requirement: 3D WebGL MapLibre GL Rendering
The application SHALL render a modern hardware-accelerated 3D map canvas using MapLibre GL.

#### Scenario: Verify MapLibre map initialization
- **WHEN** the map component is mounted
- **THEN** it SHALL initialize a MapLibre GL map instance on a WebGL canvas

### Requirement: Base Style & Terrain Toggling
The map component SHALL support toggling styles (Cyber Dark, Satellite Hybrid, 3D Elevation / Terrain).

#### Scenario: Switch map base style
- **WHEN** style toggles are selected by the user
- **THEN** the map SHALL dynamically update its style sources and set terrain exaggeration to 1.5 when DEM terrain is active

### Requirement: Location Search Autocomplete
The map component SHALL overlay a floating location search input using the Photon API.

#### Scenario: Search and fly to coordinate
- **WHEN** a search query is submitted and a result is clicked
- **THEN** the map camera SHALL fly to the coordinates with pitch tilt and bearing rotation

### Requirement: Checkpoints and Route Lines
The map component SHALL allow adding checkpoints and drawing route lines via the OSRM routing API.

#### Scenario: Verify polyline route rendering
- **WHEN** a checkpoint is added
- **THEN** the system SHALL query OSRM and draw a glowing cyan polyline overlay layer on the WebGL canvas
