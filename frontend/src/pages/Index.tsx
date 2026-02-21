import { Monitor, Activity, BarChart3, AlertCircle } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { GlobalHealth } from "@/components/dashboard/GlobalHealth";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { IncidentPanel } from "@/components/dashboard/IncidentPanel";
import { NetworkGrid } from "@/components/dashboard/NetworkGrid";
import { StepBreakdownTable } from "@/components/dashboard/StepBreakdownTable";
import { FaultButton } from "@/components/dashboard/FaultButton";

const Index = () => {
  const { metrics, isLive } = useDashboardMetrics();
  const latestIncident = metrics.incident_panel[0] ?? null;

  return (
    <div className="min-h-screen bg-background p-2">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-3 bg-card p-3 rounded-md border border-border">
        <div className="flex items-center gap-3">
          <Monitor className="h-5 w-5 text-sre-purple" />
          <h1 className="text-sm font-bold text-foreground tracking-tight">Application + Infrastructure Overview</h1>
          <div className="flex items-center gap-1.5 ml-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-sre-green pulse-green" : "bg-sre-yellow"}`} />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {isLive ? "Live" : "Simulated"}
            </span>
          </div>
        </div>
        <FaultButton />
      </header>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* Pillar 1: Metrics (Purple) */}
        <div className="flex flex-col gap-2">
          {/* Thick Colored Header */}
          <div className="bg-sre-purple text-white text-center py-2 text-xl font-bold uppercase tracking-wider rounded-t-sm shadow-md">
            Metrics
          </div>

          <div className="bg-card border border-border flex flex-col gap-2">
            <div className="p-2 border-b border-border/50">
              <GlobalHealth health={metrics.global_health} errorBudget={metrics.sla_error_budget} />
            </div>

            {/* SLA Error Budget */}
            <div className="p-3 border-b border-border/50">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Error Budget</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold font-mono text-foreground text-center w-full">
                  {metrics.sla_error_budget.budget_remaining_pct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                <span>{metrics.sla_error_budget.slo_target}</span>
              </div>
              <div className="h-3 w-full bg-background border border-border overflow-hidden flex">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${metrics.sla_error_budget.budget_remaining_pct}%`,
                    background: metrics.sla_error_budget.budget_remaining_pct > 50
                      ? "hsl(var(--sre-green))"
                      : metrics.sla_error_budget.budget_remaining_pct > 20
                        ? "hsl(var(--sre-yellow))"
                        : "hsl(var(--sre-red))",
                  }}
                />
              </div>
            </div>

            <div className="p-2">
              <NetworkGrid breakdown={metrics.http_status_breakdown} />
            </div>
          </div>
        </div>

        {/* Pillar 2: Traces (Pink) */}
        <div className="flex flex-col gap-2">
          {/* Thick Colored Header */}
          <div className="bg-sre-pink text-white text-center py-2 text-xl font-bold uppercase tracking-wider rounded-t-sm shadow-md">
            Traces
          </div>

          <div className="bg-card border border-border flex flex-col gap-2 p-2">
            <PerformanceChart data={metrics.chart_data} latencyMetrics={metrics.latency_metrics} />

            {latestIncident && (
              <div className="mt-2">
                <StepBreakdownTable steps={latestIncident.step_breakdown} />
              </div>
            )}

            {/* HTTP Status Breakdown summary */}
            <div className="border border-border p-2 bg-background/50">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">HTTP Status Trends</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <tbody>
                    {Object.entries(metrics.http_status_breakdown)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 4)
                      .map(([code, pct]) => (
                        <tr key={code} className="border-b border-border/30 last:border-0 hover:bg-muted/50">
                          <td className={`py-1 font-bold ${parseInt(code) < 400 ? "text-sre-green" : "text-sre-red"}`}>{code}</td>
                          <td className="py-1 text-right text-muted-foreground">{pct.toFixed(1)}%</td>
                          <td className="py-1 text-right text-muted-foreground">{Math.round(80 + Math.random() * 200)}ms</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Logs (Magenta) */}
        <div className="flex flex-col gap-2 h-full">
          {/* Thick Colored Header */}
          <div className="bg-sre-magenta text-white text-center py-2 text-xl font-bold uppercase tracking-wider rounded-t-sm shadow-md">
            Logs
          </div>

          <div className="bg-card border border-border flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
            <IncidentPanel incidents={metrics.incident_panel} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
