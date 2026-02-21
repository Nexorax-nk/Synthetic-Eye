import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Search,
  Globe,
  Camera,
  Terminal,
  BookOpen,
  X,
  Ticket
} from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import type { Incident, StepBreakdown } from "@/types/dashboard";

// --- REUSED HELPER: Trace Waterfall from IncidentPanel ---
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

export default function Incidents() {
  const { metrics } = useDashboardMetrics();
  const rawIncidents = metrics?.incident_panel || [];
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [createdTickets, setCreatedTickets] = useState<Set<string>>(new Set());
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // 1. Calculate Live KPIs based on the actual incident data
  const kpis = useMemo(() => {
    // In our simplified backend, if it's in the incident_panel, it's considered an issue.
    // For realism, let's pretend tickets that are opened are "Investigating", and anything else is "Open".
    // We don't have a backend mechanism to mark "Resolved" yet, so we'll leave it at 0 for the demo.
    const openCount = rawIncidents.filter(i => !createdTickets.has(i.incident_id)).length;
    const investigatingCount = createdTickets.size;
    
    return {
      open: openCount,
      investigating: investigatingCount,
      resolved: 0, // Mocked for now
      mttr: "14m"  // Mocked for now
    };
  }, [rawIncidents, createdTickets]);

  const handleCreateTicket = () => {
    if (!selectedIncident) return;
    setIsCreatingTicket(true);
    setTimeout(() => {
      setCreatedTickets(prev => new Set(prev).add(selectedIncident.incident_id));
      setIsCreatingTicket(false);
    }, 800);
  };

  if (!metrics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          <p className="text-sm font-mono tracking-widest text-gray-400">LOADING INCIDENT LOGS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-gray-100 font-sans">
      <div className="hidden md:block border-r border-white/5 bg-black/20">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full scroll-smooth">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                Incident Management
              </h1>
              <p className="text-sm text-gray-400 font-mono">Track, triage, and resolve SLA breaches</p>
            </div>
            {/* The global create incident button is typically for manual entry, which we might not need, but we'll leave it for UI completeness */}
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20">
              Declare Incident
            </button>
          </div>
        </div>

        {/* --- DYNAMIC KPI STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<AlertTriangle />} label="Open" value={kpis.open.toString()} color="red" />
          <StatCard icon={<Search />} label="Investigating" value={kpis.investigating.toString()} color="yellow" />
          <StatCard icon={<CheckCircle2 />} label="Resolved (24h)" value={kpis.resolved.toString()} color="green" />
          <StatCard icon={<Clock />} label="MTTR" value={kpis.mttr} color="blue" />
        </div>

        {/* --- INCIDENTS LIST --- */}
        <div className="bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Active SLA Breaches</h2>
          </div>
          
          {rawIncidents.length === 0 ? (
             <div className="p-12 flex flex-col items-center justify-center text-center border-dashed border-b border-white/5">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-3" />
                <h3 className="text-lg font-bold text-gray-200">System Healthy</h3>
                <p className="text-sm font-mono text-gray-500 mt-1">No active incidents or SLA breaches detected.</p>
             </div>
          ) : (
            <div className="divide-y divide-white/5">
              {rawIncidents.map((incident) => {
                const isInvestigating = createdTickets.has(incident.incident_id);
                
                return (
                  <div 
                    key={incident.incident_id} 
                    className="p-5 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                      
                      <div className="flex items-start gap-4">
                        {/* Severity Vertical Indicator */}
                        <div className={`w-1.5 h-12 rounded-full shrink-0 ${
                          incident.http_status_code >= 500 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                          incident.http_status_code >= 400 ? 'bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]' :
                          'bg-emerald-500'
                        }`} />
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-xs font-mono font-bold text-rose-400">{incident.incident_id}</span>
                            
                            {/* Dynamic Status Badge */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                              isInvestigating 
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {isInvestigating ? 'Investigating' : 'Open'}
                            </span>
                            
                            {/* HTTP Badge */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                               incident.http_status_code >= 500 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                               "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              HTTP {incident.http_status_code}
                            </span>
                          </div>
                          
                          <h3 className="text-base font-bold text-white mb-1.5">[{incident.flow_name}] SLA Latency Breach</h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-rose-400" />
                              <span className="text-rose-400 font-bold">{incident.total_latency_ms}ms</span> total
                            </span>
                            <span className="truncate max-w-[200px]">Trace: {incident.trace_id || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="self-end md:self-center pl-6 md:pl-0">
                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-[10px] font-bold text-gray-300 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100">
                            <Search className="w-3 h-3" />
                            Investigate
                         </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- THE INVESTIGATION MODAL (Reused exactly from Dashboard) --- */}
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

              {/* SRE ACTIONS MENU */}
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

    </div>
  );
}

// --- UPDATED STAT CARD ---
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
  const colorClasses = {
    red: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    yellow: 'bg-purple-500/10 border-purple-500/20 text-purple-400', // Changed yellow to purple for "Investigating" to match the Jira button
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`border rounded-xl p-5 shadow-lg relative overflow-hidden ${colorClasses[color as keyof typeof colorClasses]}`}>
      {/* subtle background glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl rounded-full opacity-20 bg-current pointer-events-none`} />
      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</span>
      </div>
      <div className="text-3xl font-bold font-mono relative z-10">{value}</div>
    </div>
  );
};