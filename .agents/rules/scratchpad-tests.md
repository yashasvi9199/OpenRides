# Headless Chromium Testing Rule

Whenever changes are made to the layout, classes, selectors, text content, navigation elements, or views (Mobile vs Desktop) in the application:
1. You MUST review and update the headless Chromium E2E tests in [test-ui.ts](file:///home/drone/Programming/OpenRides/scratchpad/test-ui.ts).
2. Ensure that the test suite continues to pass by running `pnpm tsx scratchpad/test-ui.ts`.
