import { AlertTriangle, Clock } from "lucide-react";
import type { Incident } from "@/types/dashboard";

interface Props {
  incidents: Incident[];
}

export function IncidentPanel({ incidents }: Props) {
  return (
    <div className="p-3 space-y-3">
      {incidents.map((inc) => (
        <div key={inc.incident_id} className="border-b border-border p-2 bg-background/30 hover:bg-muted/50 transition-colors">
          {/* Incident Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-sre-magenta">#{inc.incident_id}</span>
              <span className="text-[10px] font-semibold uppercase px-1 py-0.5 rounded bg-sre-red/10 text-sre-red border border-sre-red/20">
                {inc.severity}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[9px] font-mono">
                {new Date(inc.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>

          <p className="text-[10px] font-mono text-secondary-foreground mb-2">
            <span className="text-muted-foreground">Flow:</span> {inc.flow_name}
            {inc.trace_id ? <span className="ml-2"><span className="text-muted-foreground">Trace:</span> {inc.trace_id}</span> : null}
            <span className="ml-2 text-muted-foreground">Status:</span> <span className="text-sre-red">{inc.http_status_code}</span>
          </p>

          {/* Error Stack */}
          {inc.error_stack && typeof inc.error_stack === 'string' && (
            <div className="mb-1">
              <pre className="bg-[#111216] border border-border/50 rounded p-2 text-[9px] text-sre-red/80 font-mono overflow-x-auto whitespace-pre-wrap max-h-24 overflow-y-auto">
                {inc.error_stack.split('\n')[0]} {/* Only show first line for density */}
              </pre>
            </div>
          )}

          {/* Screenshot if available */}
          {inc.screenshot_base64 && (
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Screenshot</h4>
              <img
                src={`data:image/png;base64,${inc.screenshot_base64}`}
                alt="Incident screenshot"
                className="w-full rounded border border-border"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
