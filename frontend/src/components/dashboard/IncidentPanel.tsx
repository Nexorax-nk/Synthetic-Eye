import { useState } from "react";
import { 
  Clock, 
  AlertTriangle, 
  Terminal, 
  X, 
  BookOpen, 
  Activity, 
  Globe, 
  Camera,
  Search,
  Ticket,
  CheckCircle2
} from "lucide-react";
import type { Incident, StepBreakdown } from "@/types/dashboard";

interface Props {
  incidents: Incident[];
}

// --- HELPER COMPONENT: Trace Waterfall Chart ---
function TraceWaterfall({ steps }: { steps: StepBreakdown[] }) {
  if (!steps || steps.length === 0) return null;
  const maxLatency = Math.max(...steps.map(s => s.latency_ms), 1);

  return (
    <div className="bg-black/40 border border-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-purple-400" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step-Level Trace Waterfall</h3>
      </div>
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isFailed = step.status === "failed";
          const barWidth = Math.max((step.latency_ms / maxLatency) * 100, 2); 

          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-300">{step.step_name}</span>
                <span className={isFailed ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {step.latency_ms}ms
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isFailed ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-emerald-500"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IncidentPanel({ incidents }: Props) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // NEW SRE STATE: Track which tickets have been "created"
  const [createdTickets, setCreatedTickets] = useState<Set<string>>(new Set());
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const handleCreateTicket = () => {
    if (!selectedIncident) return;
    
    setIsCreatingTicket(true);
    
    // Simulate API call to Jira/Linear
    setTimeout(() => {
      // Here you would normally fetch() to your backend to save the ticket
      console.log("🎟️ NEW TICKET CREATED:", {
        title: `[SLA Breach] ${selectedIncident.flow_name} - HTTP ${selectedIncident.http_status_code}`,
        incident_id: selectedIncident.incident_id,
        trace_id: selectedIncident.trace_id,
        timestamp: selectedIncident.timestamp,
        latency: `${selectedIncident.total_latency_ms}ms`,
        error_stack: selectedIncident.error_stack,
        // We include the screenshot in the real payload, but don't log the massive base64 string
        screenshot_attached: !!selectedIncident.screenshot_base64
      });

      setCreatedTickets(prev => new Set(prev).add(selectedIncident.incident_id));
      setIsCreatingTicket(false);
    }, 800);
  };

  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-lg bg-black/20">
        <Activity className="w-8 h-8 text-emerald-500/50 mb-2" />
        <span className="text-sm font-mono text-gray-500">No active incidents detected. System healthy.</span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500 font-mono">
              <th className="pb-3 pl-2 font-semibold">Timestamp</th>
              <th className="pb-3 font-semibold">Incident / Trace ID</th>
              <th className="pb-3 font-semibold">HTTP Status</th>
              <th className="pb-3 font-semibold">Total Latency</th>
              <th className="pb-3 text-right pr-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => {
              const hasTicket = createdTickets.has(inc.incident_id);
              return (
                <tr 
                  key={inc.incident_id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" 
                  onClick={() => setSelectedIncident(inc)}
                >
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Clock className="w-3 h-3 opacity-50" />
                      {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-400">{inc.incident_id}</span>
                        {hasTicket && <span className="bg-purple-500/20 text-purple-400 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider font-bold">Ticket Open</span>}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono truncate max-w-[150px]">{inc.trace_id || "No trace generated"}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                      inc.http_status_code >= 500 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      inc.http_status_code >= 400 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      HTTP {inc.http_status_code}
                    </span>
                  </td>
                  <td className="py-3 text-xs font-mono text-rose-400 font-bold">
                    {inc.total_latency_ms}ms
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button 
                      className="flex items-center justify-end gap-1 w-full text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); setSelectedIncident(inc); }}
                    >
                      <Search className="w-3 h-3" />
                      Investigate
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">Incident Report: {selectedIncident.incident_id}</h2>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{new Date(selectedIncident.timestamp).toUTCString()}</p>
                </div>
              </div>

              {/* NEW SRE ACTIONS MENU */}
              <div className="flex items-center gap-3">
                {createdTickets.has(selectedIncident.incident_id) ? (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Jira Ticket Sent
                  </div>
                ) : (
                  <button 
                    onClick={handleCreateTicket}
                    disabled={isCreatingTicket}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
                  >
                    <Ticket className="w-4 h-4" />
                    {isCreatingTicket ? "Syncing..." : "Create Ticket"}
                  </button>
                )}
                
                <div className="w-px h-6 bg-white/10 mx-1" />
                
                <button 
                  onClick={() => setSelectedIncident(null)} 
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN: Data & Traces */}
              <div className="flex flex-col gap-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Flow Name</span>
                    <span className="text-xs font-mono text-gray-200">{selectedIncident.flow_name}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Edge Region</span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-200">
                      <Globe className="w-3 h-3 text-blue-400" />
                      {selectedIncident.region || "ap-south-1"}
                    </div>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3">
                    <span className="text-[9px] text-rose-500/70 uppercase tracking-widest block mb-1">Total Latency</span>
                    <span className="text-sm font-mono font-bold text-rose-400">{selectedIncident.total_latency_ms}ms</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Trace ID</span>
                    <span className="text-[10px] font-mono text-purple-400">{selectedIncident.trace_id || "N/A"}</span>
                  </div>
                </div>

                {selectedIncident.triage_advice && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI Action Plan</span>
                    </div>
                    <p className="text-sm text-blue-100 mb-3 font-medium leading-relaxed">{selectedIncident.triage_advice.action}</p>
                    <a 
                      href={selectedIncident.triage_advice.runbook_url} 
                      className="text-[10px] font-mono font-bold text-blue-300 hover:text-white hover:bg-blue-500/30 border border-blue-500/30 bg-blue-500/20 px-3 py-2 rounded inline-flex items-center gap-2 transition-all"
                    >
                      Execute Runbook ↗
                    </a>
                  </div>
                )}

                <TraceWaterfall steps={selectedIncident.step_breakdown} />
              </div>

              {/* RIGHT COLUMN: Evidence */}
              <div className="flex flex-col gap-4">
                
                <div className="flex flex-col h-full min-h-[300px]">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">UI State Capture</h3>
                  </div>
                  {selectedIncident.screenshot_base64 ? (
                    <div className="flex-1 rounded-lg border border-white/10 overflow-hidden bg-[#050505] flex items-center justify-center p-2 relative">
                      {/* Ticket Evidence Tag overlay on the image */}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-gray-400 uppercase tracking-widest z-10">
                        Evidence ID: {selectedIncident.incident_id}
                      </div>
                      <img 
                        src={`data:image/png;base64,${selectedIncident.screenshot_base64}`} 
                        alt="Playwright DOM Capture" 
                        className="w-full h-auto max-h-[400px] object-contain rounded border border-white/5 shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
                      <Camera className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-xs font-mono text-gray-500">No visual evidence captured.</span>
                    </div>
                  )}
                </div>

                {selectedIncident.error_stack && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Raw Exception</h3>
                    </div>
                    <div className="bg-[#050505] border border-red-500/20 rounded-lg p-4 overflow-x-auto relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                      <pre className="text-[11px] text-rose-400/90 font-mono whitespace-pre-wrap leading-relaxed">
                        {selectedIncident.error_stack}
                      </pre>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}