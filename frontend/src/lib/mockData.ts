import type { DashboardMetrics } from "@/types/dashboard";

let callCount = 0;

export function generateMockMetrics(): DashboardMetrics {
  callCount++;
  const jitter = () => (Math.random() - 0.5) * 10;
  const now = Date.now();

  const chartData = Array.from({ length: 20 }, (_, i) => {
    const isFailed = i === 14 || (callCount % 5 === 0 && i === 8);
    return {
      time: new Date(now - (19 - i) * 15000).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      latency: Math.max(50, 180 + jitter() * 6 + (isFailed ? 400 : 0)),
      status: isFailed ? "failed" as const : "passed" as const,
    };
  });

  return {
    global_health: {
      system_status: callCount % 7 === 0 ? "Degraded" : "Operational",
      availability_pct: parseFloat((99.95 + Math.random() * 0.04).toFixed(3)),
      error_rate_pct: parseFloat((0.02 + Math.random() * 0.08).toFixed(3)),
      total_requests: 120 + callCount * 5,
      active_incidents_count: 3
    },
    sla_error_budget: {
      slo_target: "p99 < 2000.0ms & 99.0% Uptime",
      budget_remaining_pct: parseFloat((72 + jitter() * 0.5).toFixed(1)),
    },
    chart_data: chartData,
    latency_metrics: {
      p50_ms: Math.round(150 + jitter()),
      p95_ms: Math.round(210 + jitter()),
      p99_ms: Math.round(380 + jitter() * 2),
      max_latency_ms: Math.round(500 + jitter() * 3)
    },
    incident_panel: [
      {
        incident_id: "INC-4821",
        severity: "High",
        flow_name: "Checkout → Payment Gateway",
        timestamp: new Date(now - 120000).toISOString(),
        status: "failed",
        http_status_code: 504,
        total_latency_ms: 10200,
        step_breakdown: [
          { step_name: "Navigate to /cart", latency_ms: 120, status: "passed" },
          { step_name: "Click Checkout", latency_ms: 89, status: "passed" },
          { step_name: "Submit Payment", latency_ms: 5200, status: "failed" },
          { step_name: "Confirm Order", latency_ms: 0, status: "skipped" },
        ],
        error_stack: `TimeoutError: Navigation timeout of 5000ms exceeded`,
        screenshot_base64: "",
      },
      {
        incident_id: "INC-4820",
        severity: "High",
        flow_name: "User Login → Dashboard Load",
        timestamp: new Date(now - 300000).toISOString(),
        status: "failed",
        http_status_code: 500,
        total_latency_ms: 8500,
        step_breakdown: [
          { step_name: "Navigate to /login", latency_ms: 95, status: "passed" },
          { step_name: "Fill credentials", latency_ms: 210, status: "passed" },
          { step_name: "Submit login", latency_ms: 1800, status: "passed" },
          { step_name: "Wait for dashboard", latency_ms: 8400, status: "failed" },
        ],
        error_stack: `Error: expect(received).toBeVisible()`,
        screenshot_base64: "",
      },
      {
        incident_id: "INC-4819",
        severity: "High",
        flow_name: "Search → Product Detail",
        timestamp: new Date(now - 600000).toISOString(),
        status: "failed",
        http_status_code: 404,
        total_latency_ms: 6100,
        step_breakdown: [
          { step_name: "Navigate to /search", latency_ms: 110, status: "passed" },
          { step_name: "Type query", latency_ms: 340, status: "passed" },
          { step_name: "Click result", latency_ms: 6100, status: "failed" },
        ],
        error_stack: `TimeoutError: Waiting for selector "article.product-card" timeout`,
        screenshot_base64: "",
      },
    ],
    http_status_breakdown: {
      "200": 82.4 + jitter() * 0.3,
      "301": 4.2,
      "404": 2.1 + Math.random() * 0.5,
      "500": 1.8 + Math.random() * 0.3,
      "502": 0.6,
      "504": 8.9 + Math.random() * 0.5,
    },
  };
}
