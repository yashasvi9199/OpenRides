## Why

The current single view layout mixes desktop and mobile responsive logic in a single file (`App.tsx`), making it difficult to maintain and optimize. Furthermore, static sizing and font values lead to UI inconsistencies across different screen resolutions. Separating the layouts and leveraging dynamic CSS `clamp()` functions will ensure a flawless, fluid, and scalable UI across all device categories.

## What Changes

- Separate view components for Mobile and Desktop layouts to allow clean optimizations per platform.
- Eliminate static font sizing (`font-size` with hardcoded `px`/`rem` without responsiveness) and layout dimensions, replacing them with dynamic fluid values via CSS `clamp()`.
- Ensure all key UI elements (buttons, layout sections, fonts) scale smoothly relative to viewport dimensions without layout breakage.

## Capabilities

### New Capabilities

- `ui/responsive-views`: Implementation of distinct Mobile/Desktop view structures with CSS clamp-based fluid layouts.

### Modified Capabilities

## Impact

- `src/App.tsx`: Refactored to act as a router/controller that dynamically renders either the Desktop or Mobile view component based on viewport size.
- New CSS or styles defined using clamp properties for dynamic font-sizing and spacing.
