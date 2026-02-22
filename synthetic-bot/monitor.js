const { chromium } = require('playwright');
const crypto = require('crypto'); // For generating trace IDs
const axios = require('axios');
const FormData = require('form-data');

// ==========================================
// ⚙️ SRE CONFIGURATION
// ==========================================
const INGEST_API_URL = 'http://localhost:8000/api/ingest'; // Your FastAPI backend
const TARGET_APP_URL = 'http://localhost:5173';            // Your dummy React app
const SLA_TIMEOUT = 2000;                                  // Strict 2-second timeout for steps
const REGION = 'aws-ap-south-1';                           // Edge node simulation
const CYCLE_TIME_MS = 60000;                               // 60-second continuous loop
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1474940592663564491/i3TWm6nM4jquuEuJb8QP6a0XNaglmE-YgXBlaKYNWVU67j1qAH9WJaqcssTVSI2u3s8O';

// ==========================================
// 🔊 DISCORD ALERT INTEGRATION
// ==========================================
async function sendDiscordAlert(errorMsg, traceId, screenshotBuffer) {
    if (!DISCORD_WEBHOOK_URL) return;

    try {
        const form = new FormData();

        // 1. The message payload
        form.append('payload_json', JSON.stringify({
            content: `🚨 **SLA Breach Detected!**\n**Trace ID:** \`${traceId}\`\n**Error:** \`\`\`${errorMsg}\`\`\``,
            username: "Synthetic Eye Bot"
        }));

        // 2. Attach the raw image buffer (tell Discord it's a PNG so it renders it in chat)
        form.append('file', screenshotBuffer, {
            filename: 'error-screenshot.png',
            contentType: 'image/png'
        });

        // 3. Fire the request
        await axios.post(DISCORD_WEBHOOK_URL, form, {
            headers: form.getHeaders()
        });
        console.log('✅ Discord alert sent with screenshot!');

    } catch (error) {
        console.error('❌ Failed to send Discord alert:', error.message);
    }
}


async function runSyntheticFlow() {
    console.log(`\n🤖 [${new Date().toLocaleTimeString()}] Waking up. Starting 60-second patrol...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    const traceId = `tx-${crypto.randomUUID().split('-')[0]}`;
    const startTime = Date.now();
    const stepBreakdown = [];
    let httpStatusCode = 200; // Assume 200 OK unless network sniffing catches an error

    // --- NETWORK SNIFFER ---
    // Listens to the network tab. Catch any 4xx or 5xx from our backend
    page.on('response', response => {
        if (response.url().includes('/api/') && response.status() >= 400) {
            httpStatusCode = response.status();
        }
    });

    // --- STEP TRACKER HELPER ---
    // Wraps every click in a stopwatch. If it fails, wait a moment for the React UI to show the error before throwing.
    async function executeStep(stepName, action) {
        const stepStart = Date.now();
        try {
            await action();
            // Wait for React routing and generic network requests to settle after a successful action
            try { await page.waitForLoadState('networkidle', { timeout: 1500 }); } catch (e) { }

            const latency = Date.now() - stepStart;
            stepBreakdown.push({ step_name: stepName, latency_ms: latency, status: 'success' });
            console.log(`   ✅ ${stepName} (${latency}ms)`);
        } catch (error) {
            // Critical fix: When an action fails (timeout, crash, etc), wait for the UI to visibly react 
            // before we actually throw the error upstream to the screenshot handler.
            console.log(`   ❌ ${stepName} FAILED. Waiting for UI error state to settle...`);
            try { await page.waitForLoadState('networkidle', { timeout: 2000 }); } catch (e) { }
            await page.waitForTimeout(1000); // Buffer for React state updates and CSS animations to finish

            const latency = Date.now() - stepStart;
            stepBreakdown.push({ step_name: stepName, latency_ms: latency, status: 'failed' });
            throw error; // Rethrow to trigger the main crash handler which takes the screenshot
        }
    }

    try {
        // ==========================================
        // THE USER JOURNEY (Browser Automation)
        // ==========================================

        await executeStep('Load Site', async () => {
            await page.goto(TARGET_APP_URL, { waitUntil: 'domcontentloaded' });
        });

        await executeStep('Login', async () => {
            await page.fill('[data-testid="email-input"]', 'admin@hack.com');
            await page.fill('[data-testid="password-input"]', '12345');

            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/api/auth/login') && res.request().method() === 'POST', { timeout: SLA_TIMEOUT + 4000 }).catch(() => null),
                page.locator('[data-testid="login-btn"]').click({ timeout: SLA_TIMEOUT })
            ]);

            if (response && !response.ok()) {
                throw new Error(`Login failed with HTTP ${response.status()}`);
            }

            // Assert success by ensuring the user reaches the catalog view
            await page.waitForSelector('text=All Tech Products', { timeout: 3000 });
        });

        await executeStep('Add to Cart', async () => {
            await page.locator('button:has-text("Add to Cart")').first().waitFor({ timeout: 4000 });

            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST', { timeout: SLA_TIMEOUT + 4000 }).catch(() => null),
                page.locator('button:has-text("Add to Cart")').first().click({ timeout: SLA_TIMEOUT })
            ]);

            if (response && !response.ok()) {
                throw new Error(`Add to Cart failed with HTTP ${response.status()}`);
            }

            // Wait a moment for cart bubble to update
            await page.waitForTimeout(500);
        });

        await executeStep('Checkout', async () => {
            await page.locator('[data-testid="nav-cart-btn"]').click({ timeout: SLA_TIMEOUT });

            // Wait for cart page to render and checkout button to appear
            await page.locator('[data-testid="checkout-btn"]').waitFor({ timeout: 3000 });

            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/api/orders') && res.request().method() === 'POST', { timeout: SLA_TIMEOUT + 4000 }).catch(() => null),
                page.locator('[data-testid="checkout-btn"]').click({ timeout: SLA_TIMEOUT })
            ]);

            if (response && !response.ok()) {
                throw new Error(`Checkout failed with HTTP ${response.status()}`);
            }

            // The golden rule: We must assert the success screen. 
            await page.waitForSelector('text=Order Successful', { timeout: 3000 });
            await page.waitForTimeout(500);
        });

        // ==========================================
        // SUCCESS HANDLING
        // ==========================================
        const totalLatency = Date.now() - startTime;

        const successPayload = {
            timestamp: new Date().toISOString(),
            flow_name: "Primary_Checkout_Flow",
            status: "success",
            http_status_code: httpStatusCode,
            total_latency_ms: totalLatency,
            step_breakdown: stepBreakdown,
            region: REGION,
            browser_engine: "chromium-headless",
            trace_id: traceId
        };

        try {
            await fetch(INGEST_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(successPayload)
            });
            console.log(`✅ Flow Complete. Trace ID: ${traceId} | Total Time: ${totalLatency}ms`);
        } catch (e) {
            console.error(`⚠️ Could not reach FastAPI backend at ${INGEST_API_URL}`);
        }

    } catch (error) {
        const totalLatency = Date.now() - startTime;

        // If Playwright timed out before the server even responded, it's a Gateway Timeout
        if (httpStatusCode === 200 && error.message.includes('Timeout')) {
            httpStatusCode = 504;
        }

        // 1. Capture the visual evidence (Base64 format for the React UI)
        try { await page.waitForLoadState('networkidle', { timeout: 2000 }); } catch (e) { }
        await page.waitForTimeout(1500); // Strict wait for React error overlay or blank state to settle
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        require('fs').writeFileSync('last_error.png', screenshotBuffer);
        const screenshotBase64 = screenshotBuffer.toString('base64');

        // 🚀 Fire the Webhook with the buffer we just captured!
        await sendDiscordAlert(error.message, traceId, screenshotBuffer);

        const failurePayload = {
            timestamp: new Date().toISOString(),
            flow_name: "Primary_Checkout_Flow",
            status: "failed",
            http_status_code: httpStatusCode,
            total_latency_ms: totalLatency,
            step_breakdown: stepBreakdown,
            region: REGION,
            browser_engine: "chromium-headless",
            trace_id: traceId,
            error_type: error.name || "TimeoutExceeded",
            error_stack: error.message,
            screenshot_base64: screenshotBase64
        };

        // 2. Fire the alarm to FastAPI
        try {
            await fetch(INGEST_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(failurePayload)
            });
            console.log(`🚨 SLA BREACH DETECTED! Data and Screenshot sent to Engine. HTTP Status: ${httpStatusCode}`);
        } catch (e) {
            console.error(`⚠️ Could not reach FastAPI backend at ${INGEST_API_URL} to send alert!`);
        }

    } finally {
        await browser.close();
        console.log(`💤 Going back to sleep for 60 seconds...`);
    }
}

runSyntheticFlow();

// Then repeat every 60 seconds
setInterval(runSyntheticFlow, CYCLE_TIME_MS);