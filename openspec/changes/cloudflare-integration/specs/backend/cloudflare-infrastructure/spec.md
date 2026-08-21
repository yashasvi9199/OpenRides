## Purpose
Establishes the backend architecture utilizing Cloudflare Pages Functions, Cloudflare Workers, Cloudflare D1 SQLite database, and Cloudflare R2 storage, strictly following the code limits and security rules.

## ADDED Requirements

### Requirement: Feature-Based Workspace Organization
The project codebase layout SHALL be organized using a feature-based structure for code separation, isolating components, models, hooks, and types by feature modules.

#### Scenario: Code structure verification
- **WHEN** browsing the workspace
- **THEN** all core features are grouped under feature modules with no monolithic stylesheets and separate feature styling.

### Requirement: Cloudflare Pages and Workers API Routing
The application SHALL have a clear routing separation for APIs: normal usage APIs (upload, download, data fetching) run on Cloudflare Pages Functions in the `functions/` folder, and heavy usage APIs (Auth, Password Reset) run on Cloudflare Workers in the `worker/` folder.

#### Scenario: Pages Functions execution
- **WHEN** user uploads or downloads files or performs light data queries
- **THEN** requests are routed to and processed by Cloudflare Pages Functions.

#### Scenario: Workers execution
- **WHEN** user performs Authentication or Password Reset operations
- **THEN** requests are routed to and processed by Cloudflare Workers.

### Requirement: Code Limit Enforcements
No function in the backend handlers SHALL exceed 150 lines of code, and no single source file SHALL exceed 300 lines of code.

#### Scenario: Static analysis check on line counts
- **WHEN** validating source files
- **THEN** all functions are under 150 lines and all files are under 300 lines of code.

### Requirement: Cloudflare Storage and Database
The application SHALL map its persistent state to Cloudflare D1 SQLite for relational data and Cloudflare R2 for file and media storage, using ORM parameterization and pre-signed URLs.

#### Scenario: SQLite operations
- **WHEN** querying or modifying structured data
- **THEN** queries are executed parameterised against Cloudflare D1 DB.

#### Scenario: File uploads to R2
- **WHEN** uploading media assets
- **THEN** media files are validated server-side, mapped to secure UUID filenames, and stored in Cloudflare R2 using pre-signed URLs.

### Requirement: API Security and Rate Limiting
The backend SHALL implement rate limiting (Token Bucket/Fixed Window) and security validations on sensitive routes.

#### Scenario: Rate limiting auth endpoint
- **WHEN** client sends more than 1 request per 120 seconds to auth endpoints
- **THEN** the request is blocked and throttled.
