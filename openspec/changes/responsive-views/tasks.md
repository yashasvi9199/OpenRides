## 1. Modular Sizing Layout & Utilities Setup

- [x] 1.1 Define CSS variables and clamp-based styling classes in `src/index.css` for dynamic fonts, margins, and padding.
- [ ] 1.2 Implement type definitions or imports required for Desktop/Mobile views.

## 2. Separate View Implementations

- [ ] 2.1 Create the `src/features/views/DesktopView.tsx` component and migrate the desktop-specific layout markup from `src/App.tsx`.
- [ ] 2.2 Create the `src/features/views/MobileView.tsx` component and migrate the mobile-specific layout markup from `src/App.tsx`.
- [ ] 2.3 Refactor layout elements within both view files to use fluid clamp styling instead of static size/spacing variables.

## 3. Dynamic Router and App Integration

- [ ] 3.1 Refactor `src/App.tsx` to handle window/viewport size tracking.
- [ ] 3.2 Update `src/App.tsx` to dynamically render `DesktopView` or `MobileView` based on viewport breakpoint without duplicate state.

## 4. Verification

- [ ] 4.1 Verify layout visual presentation, fonts, and action buttons scale properly using fluid clamp values.
- [ ] 4.2 Run pre-commit build and lint checks to ensure strict compilation.
