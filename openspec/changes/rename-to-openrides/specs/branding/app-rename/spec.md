## Purpose

Defines requirements for updating legancy branding from MotoGuard to OpenRides across UI, meta-tags, deep links, and PDF files.

## ADDED Requirements

### Requirement: Application Title and Branding Rename
The application SHALL replace all user-facing references of "MotoGuard" with "OpenRides".

#### Scenario: Verify main page header title
- **WHEN** the application loads
- **THEN** the main page header SHALL display "OpenRides" instead of "MotoGuard"

#### Scenario: Verify HTML title and Meta Tags
- **WHEN** the index page is parsed by a crawler
- **THEN** the `<title>` and `og:title` tags SHALL contain "OpenRides"

### Requirement: Deep Links and Storage Keys Rename
The application SHALL update deep links and local storage identifiers to use "openrides" prefix.

#### Scenario: Join group deep link check
- **WHEN** generating a join group link or QR code
- **THEN** the URL scheme/value SHALL be prefixed with "openrides://join/" instead of "motoguard://join/"
