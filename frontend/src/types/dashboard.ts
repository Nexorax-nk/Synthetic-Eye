export interface GlobalHealth {
  system_status: string;
  availability_pct: number;
  error_rate_pct: number;
  total_requests: number;
  active_incidents_count: number;
}

export interface SlaErrorBudget {
  slo_target: string;
  budget_remaining_pct: number;
}

export interface ChartDataPoint {
  time: string;
  latency: number;
  status: "success" | "failed"; // Fixed to match our backend bot payload
}

export interface LatencyMetrics {
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  max_latency_ms: number;
}

export interface StepBreakdown {
  step_name: string;
  latency_ms: number;
  status: string;
}

// --- NEW SRE INTERFACE ---
export interface TriageAdvice {
  action: string;
  runbook_url: string;
}

export interface Incident {
  incident_id: string;
  severity: string;
  flow_name: string;
  timestamp: string;
  status: string;
  http_status_code: number;
  total_latency_ms: number;
  step_breakdown: StepBreakdown[];
  error_type?: string;
  error_stack?: string;
  screenshot_base64?: string;
  trace_id?: string;
  
  // --- NEW SRE FIELDS ---
  region?: string;
  triage_advice?: TriageAdvice;
}

export interface HttpStatusBreakdown {
  [statusCode: string]: number | string;
}

export interface DashboardMetrics {
  global_health: GlobalHealth;
  sla_error_budget: SlaErrorBudget;
  chart_data: ChartDataPoint[];
  latency_metrics: LatencyMetrics;
  incident_panel: Incident[];
  http_status_breakdown: HttpStatusBreakdown;
}