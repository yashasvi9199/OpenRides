## Context

Currently, `src/App.tsx` contains monolithic routing logic alongside responsive desktop and mobile view layouts. Standard CSS media query breakpoints are used, but sizing values are mostly static pixel/rem units, leading to inconsistent sizing on non-standard display sizes. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Separate the desktop and mobile layouts into dedicated, modular view components.
- Introduce dynamic sizing using CSS `clamp()` properties for headings, body text, buttons, and sections.
- Make margins and paddings dynamic based on screen viewport sizes.

**Non-Goals:**
- Rewriting the state management or actions in the store.
- Changing the feature logic (e.g. Map tracking, SOS triggers).

## Decisions

### 1. View Separation Strategy
We will extract Desktop and Mobile layouts into `src/features/views/DesktopView.tsx` and `src/features/views/MobileView.tsx`. `src/App.tsx` will detect screen width dynamically (via a custom resize listener hook or standard matchMedia) and render the appropriate view.

*Rationale:* Keeping Mobile and Desktop views separated reduces cognitive load and allows platform-specific layouts to scale cleanly.

### 2. Sizing Fluidity with CSS clamp()
We will replace static text sizes and spacings in components with CSS `clamp()`. We will define standard fluid custom classes or inline styles using CSS variables dynamically calculated or using screen width relative values (e.g., `clamp(1rem, 2.5vw, 2.5rem)`).
We will add utility utility classes in `src/index.css` or direct inline style parameters where Tailwind does not support dynamic fluid properties directly.

*Rationale:* Avoids pixelated or excessively large/small text on large desktop monitors or small mobile screens.

## Risks / Trade-offs

- [Risk] Server-side rendering (SSR) mismatch since screen width is only known client-side.
  - *Mitigation:* Perform media query-based responsive class rendering (`hidden md:block` / `md:hidden`) or only initialize layout after mount (`useEffect`) to avoid hydration mismatch.
