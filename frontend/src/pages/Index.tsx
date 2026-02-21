import { Monitor, Activity, BarChart3, AlertCircle } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { GlobalHealth } from "@/components/dashboard/GlobalHealth";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { IncidentPanel } from "@/components/dashboard/IncidentPanel";
import { NetworkGrid } from "@/components/dashboard/NetworkGrid";
import { StepBreakdownTable } from "@/components/dashboard/StepBreakdownTable";
import { FaultButton } from "@/components/dashboard/FaultButton";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const { metrics, isLive } = useDashboardMetrics();
  const latestIncident = metrics.incident_panel[0] ?? null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-6 bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Application + Infrastructure Overview</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-2 w-2 rounded-full ${isLive ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-yellow-400 shadow-lg shadow-yellow-400/50"}`} />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {isLive ? "Live" : "Simulated"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Pillar 1: Metrics */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 text-lg font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-500/30">
              Metrics
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-4 p-4 shadow-xl">
              <div className="p-3 border-b border-white/10">
                <GlobalHealth health={metrics.global_health} errorBudget={metrics.sla_error_budget} />
              </div>

              {/* SLA Error Budget */}
              <div className="p-4 border-b border-white/10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Error Budget</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold font-mono text-white text-center w-full">
                    {metrics.sla_error_budget.budget_remaining_pct.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{metrics.sla_error_budget.slo_target}</span>
                </div>
                <div className="h-3 w-full bg-black/30 border border-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full transition-all duration-700 rounded-full"
                    style={{
                      width: `${metrics.sla_error_budget.budget_remaining_pct}%`,
                      background: metrics.sla_error_budget.budget_remaining_pct > 50
                        ? "linear-gradient(90deg, #10b981, #059669)"
                        : metrics.sla_error_budget.budget_remaining_pct > 20
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, #ef4444, #dc2626)",
                    }}
                  />
                </div>
              </div>

              <div className="p-3">
                <NetworkGrid breakdown={metrics.http_status_breakdown} />
              </div>
            </div>
          </div>

          {/* Pillar 2: Traces */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-3 text-lg font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/30">
              Traces
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-4 p-4 shadow-xl">
              <PerformanceChart data={metrics.chart_data} latencyMetrics={metrics.latency_metrics} />

              {latestIncident && (
                <div className="mt-2">
                  <StepBreakdownTable steps={latestIncident.step_breakdown} />
                </div>
              )}

              {/* HTTP Status Breakdown summary */}
              <div className="border border-white/10 p-4 bg-black/20 rounded-xl backdrop-blur-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">HTTP Status Trends</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <tbody>
                      {Object.entries(metrics.http_status_breakdown)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 4)
                        .map(([code, pct]) => (
                          <tr key={code} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className={`py-2 font-bold ${parseInt(code) < 400 ? "text-green-400" : "text-red-400"}`}>{code}</td>
                            <td className="py-2 text-right text-gray-400">{pct.toFixed(1)}%</td>
                            <td className="py-2 text-right text-gray-400">{Math.round(80 + Math.random() * 200)}ms</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Logs */}
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 text-lg font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/30">
              Logs
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl flex-1 overflow-y-auto shadow-xl" style={{ maxHeight: "calc(100vh - 180px)" }}>
              <IncidentPanel incidents={metrics.incident_panel} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
