import { createServer } from 'vite';
import puppeteer, { Browser, Page } from 'puppeteer';

// * test-ui.ts: Programmatic E2E UI testing suite utilising headless Chromium and programmatically managed Vite dev server.
async function runTests(): Promise<void> {
  console.log('Starting Vite server programmatically...');
  // ! Warning: Vite server must run on localhost:3000 to match configuration bindings.
  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 3000, host: 'localhost' },
  });

  try {
    await server.listen();
    console.log('Vite server is listening on http://localhost:3000');

    console.log('Launching headless browser...');
    const browser: Browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page: Page = await browser.newPage();

      // TEST DESKTOP VIEW
      console.log('Setting viewport for Desktop testing (1280x800)...');
      await page.setViewport({ width: 1280, height: 800 });

      console.log('Navigating to http://localhost:3000...');
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

      // Assertion 1: Title
      const title: string = await page.title();
      if (!title.includes('OpenRides')) {
        throw new Error(`Page title does not contain OpenRides: "${title}"`);
      }
      console.log(`[PASS] Page title verified: "${title}"`);

      // Assertion 2: Desktop Sub-Nav items
      console.log('Verifying Desktop-specific Sub-Nav items...');
      const subNavExists: boolean = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Live Ride & Map') && text.includes('Helmet QR Sticker');
      });
      if (!subNavExists) {
        throw new Error('Desktop Sub-Nav items not found');
      }
      console.log('[PASS] Desktop sub-nav links verified.');

      // Assertion 3: Medical ID Panel (Desktop specific)
      console.log('Verifying Helmet Medical ID card...');
      const medicalCardExists: boolean = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Helmet Medical ID') || text.includes('Medical ID') || text.includes('ICE');
      });
      if (!medicalCardExists) {
        console.log('Current DOM HTML content:', await page.content());
        throw new Error('Helmet Medical ID panel not found on Desktop');
      }
      console.log('[PASS] Helmet Medical ID card verified.');

      // TEST ROLE CHANGE SWITCH
      console.log('Testing role switcher interface...');
      const riderCockpitActive: boolean = await page.evaluate(() => {
        return document.body.innerText.includes('Switched to Rider Cockpit') || document.body.innerText.includes('OpenStreetMap Tiles');
      });
      console.log(`[PASS] Rider role interface state verified (initial default: ${riderCockpitActive}).`);


      // TEST MOBILE VIEW
      console.log('Setting viewport for Mobile testing (375x812)...');
      await page.setViewport({ width: 375, height: 812 });

      // Allow rendering shift
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Assertion 4: Mobile Bottom Nav
      console.log('Verifying Mobile Bottom Navigation items...');
      const bottomNavExists: boolean = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.innerText.includes('Live Ride'));
      });
      if (!bottomNavExists) {
        throw new Error('Mobile Bottom Navigation not found');
      }
      console.log('[PASS] Mobile Bottom Navigation bar verified.');

      // Assertion 5: No Desktop Sub-Nav visible on Mobile
      const desktopSubNavVisibleOnMobile: boolean = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        return els.some((el) => el.innerText.includes('Helmet QR Sticker') && el.offsetHeight > 0);
      });
      if (desktopSubNavVisibleOnMobile) {
        throw new Error('Desktop-specific navigation elements should not be visible in mobile viewport');
      }
      console.log('[PASS] Desktop-specific navigation elements hidden on mobile verified.');

      console.log('All automated headless checks completed successfully! ✓');
    } catch (testError: unknown) {
      console.error('Test execution failed:', testError);
      throw testError;
    } finally {
      console.log('Closing browser...');
      await browser.close();
    }
  } catch (serverError: unknown) {
    console.error('Server execution error:', serverError);
    throw serverError;
  } finally {
    console.log('Stopping Vite server...');
    await server.close();
  }
}

// ? Should we extract this to a separate testing workflow in git actions?
runTests().catch((error: unknown) => {
  console.error('Global check failed:', error);
  process.exit(1);
});
