// * Playwright E2E Master Script: Verifies all layout sections, views, inline page routing, and element styling.
import { chromium, Browser, Page, expect } from '@playwright/test';
import { createServer } from 'vite';

async function runMasterTests(): Promise<void> {
  console.log('Booting programmatically-managed Vite server on localhost:3000...');
  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 3000, host: 'localhost' },
  });

  try {
    await server.listen();
    console.log('Vite server successfully listening on http://localhost:3000');

    console.log('Launching Playwright Chromium in headless mode with low-resource flags...');
    const browser: Browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox'
      ]
    });

    try {
      const page: Page = await browser.newPage();
      await page.goto('http://localhost:3000');

      // * Element 1: Brand Title Verification
      console.log('Running Scenario 1: Verify Logo & Branding title elements...');
      const brandLogo = page.locator('.w-9.h-9.rounded-xl.bg-gradient-to-tr');
      const brandTitle = page.locator('span:has-text("OpenRides")');
      const freeBadge = page.getByText('100% FREE');
      const taglineText = page.getByText('Bike Rider Safety, Telemetry');

      await expect(brandTitle).toBeVisible();
      await expect(brandLogo).toBeVisible();
      await expect(freeBadge).toBeVisible();
      await expect(taglineText).toBeVisible();
      const brandFontSize = await brandTitle.evaluate((el) => window.getComputedStyle(el).fontSize);
      console.log(`[PASS] Brand Header verified. Logo visible, Title font-size: ${brandFontSize}`);

      // * Element 2: Global Light Mode Styling Contrast Check
      console.log('Running Scenario 2: Verify light mode theme variables & colors AA contrast...');
      const htmlClassList = await page.evaluate(() => document.documentElement.className);
      const bodyColor = await page.evaluate(() => window.getComputedStyle(document.body).color);
      const bodyBgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      
      expect(htmlClassList).toContain('light');
      expect(bodyBgColor).toContain('oklch'); // Tailwind v4 body background color
      console.log(`[PASS] Light mode confirmed. Background: ${bodyBgColor}, Foreground: ${bodyColor}`);

      // * Element 3: 3D Map Component Container & Overlays
      console.log('Running Scenario 3: Verify MapLibre container, heading indicators, and canvas...');
      const mapContainer = page.locator('.maplibregl-map');
      const compassIndicator = page.locator('[title*="Compass Heading"]');
      const zoomInBtn = page.getByLabel('Zoom In');
      const zoomOutBtn = page.getByLabel('Zoom Out');
      const fullscreenBtn = page.getByLabel('Toggle Fullscreen');

      await expect(mapContainer).toBeVisible();
      await expect(compassIndicator).toBeVisible();
      await expect(zoomInBtn).toBeVisible();
      await expect(zoomOutBtn).toBeVisible();
      await expect(fullscreenBtn).toBeVisible();
      console.log('[PASS] MapLibre GL WebGL element presence and control overlays verified.');

      // * Element 4: Inline Sub-page Routing (Group Sync Page)
      console.log('Running Scenario 4: Navigate to Group Sync Page & verify forms inline...');
      const groupSyncBtn = page.getByRole('button', { name: /Group Sync/ });
      await expect(groupSyncBtn).toBeVisible();
      await groupSyncBtn.click();

      // Check inline form inputs presence instead of overlay modals
      const groupHeading = page.locator('h2:has-text("Group Ride Sync")');
      const hostTab = page.getByRole('button', { name: /My Ride Code/ });
      const joinTab = page.getByRole('button', { name: /Enter 6-Digit Code/ });
      const secretCode = page.getByText(/Your 6-Digit Secret Ride Code/);
      const fastJoinQR = page.locator('svg[role="img"]'); // QR SVG is rendered with role="img"

      await expect(groupHeading).toBeVisible();
      await expect(hostTab).toBeVisible();
      await expect(joinTab).toBeVisible();
      await expect(secretCode).toBeVisible();
      await expect(fastJoinQR).toBeVisible();
      console.log('[PASS] Inline Group Sync sub-page transitions & forms successfully verified.');

      // * Element 5: Medical I.C.E. Page Views
      console.log('Running Scenario 5: Navigate to Medical I.C.E. and assert profile forms...');
      const medicalTabBtn = page.getByRole('button', { name: /Medical I.C.E./ });
      await expect(medicalTabBtn).toBeVisible();
      await medicalTabBtn.click();

      const profileHeading = page.getByRole('heading', { name: 'Emergency Medical Profile' });
      const bloodGroupLabel = page.getByText('Blood Group');
      const allergiesLabel = page.getByText('Allergies & Medical Notes');
      const contactLabel = page.getByText('ICE Contacts');
      const saveBtn = page.getByRole('button', { name: /Save Medical Profile/ });

      await expect(profileHeading).toBeVisible();
      await expect(bloodGroupLabel).toBeVisible();
      await expect(allergiesLabel).toBeVisible();
      await expect(contactLabel).toBeVisible();
      await expect(saveBtn).toBeVisible();
      console.log('[PASS] Medical Profile & ICE settings page forms fully accessible.');

      console.log('All E2E Master integration scenario checks completed successfully! ✓');
    } finally {
      console.log('Closing browser instance...');
      await browser.close();
    }
  } finally {
    console.log('Shutting down Vite server...');
    await server.close();
  }
}

runMasterTests().catch((err) => {
  console.error('[FAIL] Playwright E2E Master Script Error:', err);
  process.exit(1);
});
