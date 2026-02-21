const { chromium } = require('playwright');
const crypto = require('crypto'); // For generating trace IDs

// ==========================================
// ⚙️ SRE CONFIGURATION
// ==========================================
const INGEST_API_URL = 'http://localhost:8000/api/ingest'; // Your FastAPI backend
const TARGET_APP_URL = 'http://localhost:5173';            // Your dummy React app
const SLA_TIMEOUT = 2000;                                  // Strict 2-second timeout for steps
const REGION = 'aws-ap-south-1';                           // Edge node simulation
const CYCLE_TIME_MS = 60000;                               // 60-second continuous loop

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
    // Listens to the network tab. If the checkout API fails, we catch the exact status code (500, 504)
    page.on('response', response => {
        if (response.url().includes('/api/checkout')) {
            httpStatusCode = response.status();
        }
    });

    // --- STEP TRACKER HELPER ---
    // Wraps every click in a stopwatch to get granular latency for the React dashboard
    async function executeStep(stepName, action) {
        const stepStart = Date.now();
        try {
            await action();
            const latency = Date.now() - stepStart;
            stepBreakdown.push({ step_name: stepName, latency_ms: latency, status: 'success' });
            console.log(`   ✅ ${stepName} (${latency}ms)`);
        } catch (error) {
            const latency = Date.now() - stepStart;
            stepBreakdown.push({ step_name: stepName, latency_ms: latency, status: 'failed' });
            console.log(`   ❌ ${stepName} FAILED (${latency}ms)`);
            throw error; // Rethrow to trigger the main crash handler
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
            await page.locator('[data-testid="login-btn"]').click({ timeout: SLA_TIMEOUT });
            await page.waitForTimeout(500);
        });

        await executeStep('Add to Cart', async () => {
            await page.locator('button:has-text("Add to Cart")').first().click({ timeout: SLA_TIMEOUT });
        });

        await executeStep('Checkout', async () => {
            await page.locator('[data-testid="nav-cart-btn"]').click({ timeout: SLA_TIMEOUT });
            await page.waitForTimeout(500);
            await page.locator('[data-testid="checkout-btn"]').click({ timeout: SLA_TIMEOUT });
            await page.waitForTimeout(1000); // Simulate order processing success wait
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
        const screenshotBase64 = screenshotBuffer.toString('base64');

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