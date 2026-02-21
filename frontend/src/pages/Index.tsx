import { Monitor, AlertTriangle } from "lucide-react";
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
  const latestIncident = metrics?.incident_panel?.[0] ?? null;

  if (!metrics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Monitor className="h-8 w-8 text-purple-500" />
          <p className="text-sm font-mono tracking-widest text-gray-400">CONNECTING TO ENGINE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0a0a0f] text-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="hidden md:block border-r border-white/5 bg-black/20">
        <Sidebar />
      </div>

      {/* MAIN DASHBOARD AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full scroll-smooth">
        
        {/* --- HEADER: Environment & Demo Controls --- */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Synthetic-Eye Telemetry</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Primary Checkout Flow • ap-south-1
                </span>
              </div>
            </div>
          </div>
          
          {/* Global Actions (Put the kill switch here!) */}
          <div className="flex items-center gap-3">
            <FaultButton /> 
          </div>
        </header>

        {/* --- THE 12-COLUMN ENTERPRISE GRID --- */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">

          {/* ROW 1: Executive Summary (Spans 12 columns) */}
          <div className="col-span-12">
            <GlobalHealth health={metrics.global_health} errorBudget={metrics.sla_error_budget} />
          </div>

          {/* ROW 2: Left Side (8 cols) for Chart, Right Side (4 cols) for Breakdown */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latency Distribution (ms)</h2>
              <span className="text-[10px] text-gray-500 font-mono">Last 50 synthetic runs</span>
            </div>
            {/* Ensure PerformanceChart takes up full width/height of its container */}
            <div className="h-64 w-full">
              <PerformanceChart data={metrics.chart_data} latencyMetrics={metrics.latency_metrics} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            {/* Step Breakdown */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-sm flex-1">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">User Journey Latency</h2>
              {latestIncident ? (
                <StepBreakdownTable steps={latestIncident.step_breakdown} />
              ) : (
                <div className="text-sm text-gray-500 font-mono text-center mt-10">Awaiting trace data...</div>
              )}
            </div>
            
            {/* Network Grid */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Network Activity</h2>
              <NetworkGrid breakdown={metrics.http_status_breakdown} />
            </div>
          </div>

          {/* ROW 3: Incident Evidence Table (Spans 12 columns) */}
          <div className="col-span-12 bg-white/[0.02] border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-sm mb-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trace & Incident Logs</h2>
            </div>
            <IncidentPanel incidents={metrics.incident_panel} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;