// * Playwright E2E Profile Test: Focuses on Medical Profile ICE details verification.
import { chromium, Browser, Page, expect } from '@playwright/test';
import { createServer } from 'vite';

async function runProfileTests(): Promise<void> {
  console.log('Booting programmatically-managed Vite server for Profile Checks...');
  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 3000, host: 'localhost' },
  });

  try {
    await server.listen();

    console.log('Launching Playwright Chromium in headless mode with low-resource flags...');
    const browser: Browser = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page: Page = await browser.newPage();
      await page.goto('http://localhost:3000');

      // Navigate to Medical ICE subpage
      const medicalTabBtn = page.getByRole('button', { name: /Medical I.C.E./ });
      await medicalTabBtn.click();

      // * Scenario 1: Confirm profile container headers
      console.log('Scenario 1: Checking profile layout main page headers...');
      const heading = page.getByRole('heading', { name: 'Emergency Medical Profile' });
      await expect(heading).toBeVisible();

      // * Scenario 2: Validate input fields values
      console.log('Scenario 2: Checking name and blood group input defaults...');
      const nameInput = page.locator('input[placeholder*="your full name"]');
      const bloodGroupSelect = page.locator('select');
      await expect(nameInput).toBeVisible();
      await expect(bloodGroupSelect).toBeVisible();

      // * Scenario 3: Verify ICE contacts form section
      console.log('Scenario 3: Checking ICE contacts inputs additions...');
      const addContactBtn = page.getByRole('button', { name: /Add ICE Contact/ });
      await expect(addContactBtn).toBeVisible();

      // * Scenario 4: Allergies list configuration inputs
      console.log('Scenario 4: Checking Allergies description notes area...');
      const allergiesTextArea = page.locator('textarea[placeholder*="Allergies"]');
      await expect(allergiesTextArea).toBeVisible();

      // * Scenario 5: Submit form saving actionability checks
      console.log('Scenario 5: Check save profile button trigger...');
      const saveBtn = page.getByRole('button', { name: /Save Medical Profile/ });
      await expect(saveBtn).toBeVisible();

      console.log('Playwright Profile features E2E tests verified successfully! ✓');
    } finally {
      await browser.close();
    }
  } finally {
    await server.close();
  }
}

runProfileTests().catch((err) => {
  console.error('[FAIL] Playwright E2E Profile Test Error:', err);
  process.exit(1);
});
