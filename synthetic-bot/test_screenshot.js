const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // Sniff network to see if it even reaches the dummy store
    page.on('response', response => {
        console.log(`[NETWORK] ${response.status()} ${response.url()}`);
    });

    console.log("Navigating to store...");
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    console.log("Triggering explicit chaos mode...");
    await fetch('http://localhost:5000/api/chaos', { method: 'POST' });
    await page.waitForTimeout(1000); // give chaos API time to set flag

    try {
        console.log("Attempting checkout sequence...");
        await page.locator('button:has-text("Add to Cart")').first().click({ timeout: 2000 });
        await page.locator('[data-testid="nav-cart-btn"]').click({ timeout: 2000 });
        console.log("Clicking checkout to trigger 500 error...");
        await page.locator('[data-testid="checkout-btn"]').click({ timeout: 2000 });
    } catch (e) {
        console.log("Caught crash as expected, or timed out:", e.name);
    }

    console.log("Taking debug screenshot...");
    await page.waitForTimeout(1000); // settle time
    await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });

    await browser.close();
    console.log("Screenshot successfully saved to debug_screenshot.png");
})();
