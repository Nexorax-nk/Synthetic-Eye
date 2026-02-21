import { CheckCircle, XCircle } from "lucide-react";
import type { GlobalHealth as GlobalHealthType, SlaErrorBudget } from "@/types/dashboard";

interface Props {
  health: GlobalHealthType;
  errorBudget: SlaErrorBudget;
}

export function GlobalHealth({ health, errorBudget }: Props) {
  const isOperational = health.system_status === "Operational";

  return (
    <div className="flex flex-col gap-2">
      {/* System Status Row */}
      <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">System Status</span>
        <span className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${isOperational ? "bg-sre-green text-black" : "bg-sre-red text-white"}`}>
          {health.system_status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Availability */}
        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-border rounded">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Availability</span>
          <p className={`text-xl font-bold font-mono ${health.availability_pct > 99 ? 'text-sre-green' : 'text-sre-yellow'}`}>
            {health.availability_pct}%
          </p>
        </div>

        {/* Error Rate */}
        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-border rounded">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Error Rate</span>
          <p className={`text-xl font-bold font-mono ${health.error_rate_pct > 1 ? 'text-sre-red' : 'text-sre-green'}`}>
            {health.error_rate_pct}%
          </p>
        </div>

        {/* Total Requests */}
        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-border rounded">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Total Req</span>
          <p className="text-xl font-bold font-mono text-sre-purple">
            {health.total_requests || 0}
          </p>
        </div>

        {/* Active Incidents */}
        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-border rounded">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Incidents</span>
          <p className={`text-xl font-bold font-mono ${health.active_incidents_count > 0 ? 'text-sre-red animate-pulse' : 'text-sre-green'}`}>
            {health.active_incidents_count || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
