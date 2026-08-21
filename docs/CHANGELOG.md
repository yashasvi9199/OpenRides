# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-20

### Added
- Cloudflare Pages Functions in `/functions/` for file uploads, downloads, and rides queries.
- Cloudflare Worker in `/worker/index.ts` for Authentication and Password Reset APIs.
- Token Bucket rate limiting (30 req / 60s) for general traffic.
- Fixed Window rate limiting (1 req / 120s) for sensitive auth/reset endpoints.
- Local D1 SQLite database initialization and schemas.
- Feature-based stylesheet and types isolation.
