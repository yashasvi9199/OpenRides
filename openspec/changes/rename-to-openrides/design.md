## Context

Currently, legacy branding "MotoGuard" is hardcoded in several components, static assets, titles, storage keys, and schema definitions. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Replace all legacy "MotoGuard" / "motoguard" text and path strings with "OpenRides" / "openrides".
- Ensure storage keys and deep links remain functionally identical but updated.

**Non-Goals:**
- Modifying CSS styling or theme layout patterns.
- Changing state machine behavior in Zustand store.

## Decisions

### 1. Simple Find-and-Replace String Replacements
We will replace occurrences of "MotoGuard", "MOTOGUARD", "motoguard" in code text content, title tags, schema strings, email addresses, and deep links.

*Rationale:* This is a pure string-replacement change.

## Risks / Trade-offs

- [Risk] Local storage key mismatch: existing users will lose their session settings if `motoguard_profile_v2` is renamed.
  - *Mitigation:* We will rename the storage key to `openrides_profile_v2` but support fallback reading from `motoguard_profile_v2` if the new key doesn't exist yet to prevent session data loss.
