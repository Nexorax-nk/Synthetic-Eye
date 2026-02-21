import { 
  CheckCircle2, 
  AlertOctagon, 
  Activity, 
  ShieldAlert, 
  ServerCrash, 
  Zap,
  Calculator // Added a small icon to hint at the math
} from "lucide-react";
import type { GlobalHealth as GlobalHealthType, SlaErrorBudget } from "@/types/dashboard";

interface Props {
  health: GlobalHealthType;
  errorBudget: SlaErrorBudget;
}

export function GlobalHealth({ health, errorBudget }: Props) {
  const isOperational = health.system_status === "Operational";
  const hasIncidents = health.active_incidents_count > 0;

  // --- THE RAW CALCULATIONS ---
  // We reverse-engineer the exact number of fails and successes to show the math
  const failedReqs = Math.round((health.error_rate_pct / 100) * health.total_requests);
  const successfulReqs = health.total_requests - failedReqs;

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#121212] border border-white/10 rounded-xl shadow-2xl backdrop-blur-sm">
      
      {/* --- 1. SYSTEM STATUS HERO ROW --- */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
            Global Health
          </span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            isOperational 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
          }`}
        >
          {isOperational ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {health.system_status}
          </span>
        </div>
      </div>

      {/* --- 2. CORE METRICS GRID --- */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Availability */}
        <div className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Availability</span>
          </div>
          <p className={`text-3xl font-bold font-mono tracking-tight ${health.availability_pct >= 99 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {health.availability_pct.toFixed(2)}%
          </p>
          {/* THE RAW MATH EXPLANATION */}
          <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-gray-500">
            <Calculator className="w-3 h-3 opacity-50" />
            <span>{successfulReqs} / {health.total_requests} runs OK</span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Error Rate</span>
          </div>
          <p className={`text-3xl font-bold font-mono tracking-tight ${health.error_rate_pct > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {health.error_rate_pct.toFixed(2)}%
          </p>
          {/* THE RAW MATH EXPLANATION */}
          <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-gray-500">
            <Calculator className="w-3 h-3 opacity-50" />
            <span>{failedReqs} / {health.total_requests} runs failed</span>
          </div>
        </div>

        {/* Total Requests */}
        <div className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total Req</span>
          </div>
          <p className="text-3xl font-bold font-mono tracking-tight text-blue-400">
            {health.total_requests.toLocaleString() || 0}
          </p>
          <div className="mt-2 text-[10px] font-mono text-gray-500">
            Cumulative synthetic traces
          </div>
        </div>

        {/* Active Incidents */}
        <div className={`flex flex-col p-4 border rounded-lg transition-colors ${
          hasIncidents ? 'bg-red-500/10 border-red-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
        }`}>
          <div className="flex items-center gap-1.5 mb-2">
            <ServerCrash className={`w-3.5 h-3.5 ${hasIncidents ? 'text-red-400' : 'text-gray-400'}`} />
            <span className={`text-[10px] uppercase tracking-widest ${hasIncidents ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
              Incidents
            </span>
          </div>
          <p className={`text-3xl font-bold font-mono tracking-tight ${hasIncidents ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            {health.active_incidents_count || 0}
          </p>
          <div className={`mt-2 text-[10px] font-mono ${hasIncidents ? 'text-red-400/70' : 'text-gray-500'}`}>
            Unresolved SLA breaches
          </div>
        </div>
      </div>

      {/* --- 3. SLA ERROR BUDGET --- */}
      {errorBudget && (
        <div className="mt-2 p-4 bg-black/40 border border-white/10 rounded-lg">
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Error Budget</span>
              <span className="text-xs font-mono text-gray-500 mt-1">{errorBudget.slo_target}</span>
            </div>
            <span className={`text-xl font-bold font-mono ${errorBudget.budget_remaining_pct < 20 ? 'text-red-400' : 'text-emerald-400'}`}>
              {errorBudget.budget_remaining_pct.toFixed(1)}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                errorBudget.budget_remaining_pct > 50 ? 'bg-emerald-400' : 
                errorBudget.budget_remaining_pct > 20 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, errorBudget.budget_remaining_pct))}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
}