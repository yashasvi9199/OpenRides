## 1. Directory & Workspace Restructuring

- [x] 1.1 Restructure existing src/features directories to follow strict feature-based modules.
- [x] 1.2 Extract feature-specific TS interfaces into local .types.ts files under features/.
- [x] 1.3 Extract feature styles into local .styles.css files under features/, avoiding monolithic imports.

## 2. Cloudflare wrangler Setup & Config

- [x] 2.1 Install wrangler in package.json devDependencies.
- [x] 2.2 Create wrangler.json (or wrangler.toml) in the root directory.
- [x] 2.3 Bind Cloudflare D1 SQLite database mapping to "DB".
- [x] 2.4 Bind Cloudflare R2 bucket mapping to "BUCKET".
- [x] 2.5 Ensure wrangler local configurations (dev.vars, .env) are gitignored.

## 3. Cloudflare Pages Functions (functions/ - Normal APIs)

- [x] 3.1 Create functions/ folder in root directory.
- [x] 3.2 Implement functions/api/uploads.ts for file uploads with R2 bucket binding and Zod type checks.
- [x] 3.3 Implement functions/api/downloads.ts for file downloads with pre-signed URLs.
- [x] 3.4 Ensure functions/api/ data fetching handler is implemented with D1 SQLite integration.
- [x] 3.5 Validate that no Pages Function file exceeds 300 lines of code or 150 lines per function.

## 4. Cloudflare Workers (worker/ - Heavy APIs)

- [x] 4.1 Create worker/ folder in root directory.
- [x] 4.2 Create worker/index.ts for heavy APIs handling Auth and Reset Passwords.
- [x] 4.3 Implement Token Bucket rate limiter (30 req / 60s) for general endpoints.
- [x] 4.4 Implement Fixed Window rate limiter (1 req / 120s) for sensitive Auth/Reset endpoints.
- [x] 4.5 Validate that no Workers file exceeds 300 lines of code or 150 lines per function.

## 5. D1 SQLite Database Mapping & Schema

- [x] 5.1 Initialize local D1 database.
- [x] 5.2 Create SQL migrations under migrations/ using D1 CLI.
- [x] 5.3 Implement Zod schema mappings for database structures.
- [x] 5.4 Ensure database queries use parameterized SQL.
- [x] 5.5 Document schema mutations in docs/DATABASE.sql.

## 6. Security Headers & Verification

- [ ] 6.1 Implement CORS, CSP, and X-Frame-Options in wrangler configuration/headers.
- [ ] 6.2 Implement runtime security validations on all inputs.
- [ ] 6.3 Update docs/GUIDE.md, docs/CHANGELOG.md, and docs/RELEASE.md.
- [ ] 6.4 Run build, linting, and verify line limits are not violated.
