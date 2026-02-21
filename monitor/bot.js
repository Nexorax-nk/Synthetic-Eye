const { chromium } = require('playwright');
const crypto = require('crypto');

const FRONTEND_URL = 'http://localhost:5173'; // Pointing to the Dummy Store
const SRE_BACKEND_URL = 'http://localhost:8000/api/ingest';

async function reportTelemetry(payload) {
    try {
        const res = await fetch(SRE_BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(`📡 Reported ${payload.status} telemetry (Status: ${res.status})`);
    } catch (error) {
        console.error('Failed to report telemetry:', error.message);
    }
}

async function runCheckoutFlow(browser) {
    const context = await browser.newContext();
    const page = await context.newPage();

    const step_breakdown = [];
    const start_run = Date.now();

    try {
        // === 1. Navigation ===
        let start_step = Date.now();
        await page.goto(FRONTEND_URL);
        step_breakdown.push({ step_name: 'Home Page Load', latency_ms: Date.now() - start_step, status: 'success' });

        // Check if on login page
        if (await page.locator('input[type="email"]').isVisible()) {
            start_step = Date.now();
            await page.fill('input[type="email"]', 'admin@hack.com');
            await page.fill('input[type="password"]', '12345');
            await page.click('button:has-text("Login")');
            await page.waitForTimeout(500); // Wait for navigation

            const isLoginFailed = await page.locator('text=User not found').isVisible() || await page.locator('text=Internal Server Error').isVisible();
            if (isLoginFailed) throw new Error("Login failed or timed out.");

            step_breakdown.push({ step_name: 'Authentication', latency_ms: Date.now() - start_step, status: 'success' });
        }

        // === 2. Add To Cart ===
        start_step = Date.now();
        // Wait for products to load
        await page.waitForSelector('.grid');
        // Click the first Add to Cart button
        const addBtns = page.locator('button:has-text("Add to Cart")');
        if (await addBtns.count() > 0) {
            await addBtns.first().click();
            step_breakdown.push({ step_name: 'Add to Cart', latency_ms: Date.now() - start_step, status: 'success' });
        } else {
            throw new Error("No products found on page.");
        }

        // === 3. Checkout ===
        start_step = Date.now();
        await page.goto(`${FRONTEND_URL}/cart`);
        await page.waitForTimeout(500);

        const checkoutBtn = page.locator('button:has-text("Proceed to Checkout")');
        if (await checkoutBtn.isVisible()) {
            await checkoutBtn.click();
            // Assume a fake UI toast says order placed
            await page.waitForTimeout(1000);
        }
        step_breakdown.push({ step_name: 'Checkout Flow', latency_ms: Date.now() - start_step, status: 'success' });

        // Report Success
        await reportTelemetry({
            timestamp: new Date().toISOString(),
            flow_name: 'Automated Checkout Flow',
            status: 'success',
            http_status_code: 200,
            total_latency_ms: Date.now() - start_run,
            step_breakdown: step_breakdown
        });

    } catch (error) {
        console.error('❌ Flow Failed:', error.message);
        const screenshot = await page.screenshot({ type: 'jpeg', quality: 50 });
        const screenshot_base64 = screenshot.toString('base64');

        // Mark last step as failed
        step_breakdown.push({ step_name: 'Failed Action', latency_ms: Date.now() - start_run, status: 'failed' });

        await reportTelemetry({
            timestamp: new Date().toISOString(),
            flow_name: 'Automated Checkout Flow',
            status: 'failed',
            http_status_code: 500, // Guessing 500 for generic UI crash
            total_latency_ms: Date.now() - start_run,
            step_breakdown: step_breakdown,
            error_type: error.name || 'BotError',
            error_stack: error.stack || error.message,
            screenshot_base64: screenshot_base64
        });
    } finally {
        await context.close();
    }
}

async function main() {
    console.log('🤖 Starting Synthetic User Monitor...');
    const browser = await chromium.launch({ headless: true });

    while (true) {
        await runCheckoutFlow(browser);
        // Wait between 3 to 6 seconds before running again
        const delay = Math.floor(Math.random() * 3000) + 3000;
        await new Promise(r => setTimeout(r, delay));
    }
}

main().catch(console.error);
