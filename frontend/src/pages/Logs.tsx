import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  Info, 
  TerminalSquare, 
  CheckCircle2, 
  XCircle,
  Copy,
  Activity
} from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

interface UnifiedLog {
  id: string;
  timestamp: Date;
  level: "error" | "warn" | "info" | "success";
  message: string;
  source: string;
  latency?: number;
  traceId?: string;
}

export default function Logs() {
  const { metrics } = useDashboardMetrics();
  
  const [searchTerm, setSearchTerm] = useState("");
  // FIX 1: Changed "info" to "warn" so it matches our filter buttons perfectly
  const [activeFilter, setActiveFilter] = useState<"all" | "error" | "success" | "warn">("all");
  const [isLiveTail, setIsLiveTail] = useState(true);

  const liveLogs = useMemo<UnifiedLog[]>(() => {
    if (!metrics) return [];

    const logs: UnifiedLog[] = [];

    metrics.chart_data?.forEach((data, index) => {
      logs.push({
        id: `trace-${index}-${data.time}`,
        timestamp: new Date(data.time),
        level: data.status === "failed" ? "error" : "success",
        message: data.status === "failed" 
          ? `Playwright synthetic run failed SLA limit.` 
          : `Playwright trace completed successfully.`,
        source: "synthetic-engine",
        latency: data.latency
      });
    });

    metrics.incident_panel?.forEach((inc) => {
      logs.push({
        id: `inc-${inc.incident_id}`,
        timestamp: new Date(inc.timestamp),
        level: "error",
        message: `[HTTP ${inc.http_status_code}] Flow '${inc.flow_name}' breached SLA constraints.`,
        source: inc.region || "ap-south-1",
        latency: inc.total_latency_ms,
        traceId: inc.trace_id
      });

      if (inc.error_stack) {
        logs.push({
          id: `stack-${inc.incident_id}`,
          timestamp: new Date(new Date(inc.timestamp).getTime() + 10),
          level: "warn",
          message: `Exception caught: ${inc.error_stack.split('\n')[0].substring(0, 100)}...`,
          source: "playwright-worker",
          traceId: inc.trace_id
        });
      }
    });

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [metrics]);

  const filteredLogs = useMemo(() => {
    return liveLogs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.traceId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "all" || log.level === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [liveLogs, searchTerm, activeFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!metrics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <TerminalSquare className="h-8 w-8 text-blue-500" />
          <p className="text-sm font-mono tracking-widest text-gray-400">CONNECTING TO LOG STREAM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-gray-100 font-sans">
      <div className="hidden md:block border-r border-white/5 bg-black/20">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col w-full">
        
        <div className="p-6 md:p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                <TerminalSquare className="w-6 h-6 text-blue-400" />
                Live Log Stream
              </h1>
              <p className="text-sm text-gray-400 font-mono">Real-time telemetry and execution output</p>
            </div>
            
            <button 
              onClick={() => setIsLiveTail(!isLiveTail)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isLiveTail 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "bg-white/5 text-gray-500 border-white/10"
              }`}
            >
              {isLiveTail && <Activity className="w-3 h-3 animate-pulse" />}
              Live Tail {isLiveTail ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className="px-6 md:px-8 mb-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by trace ID, message, or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-[#121212] border border-white/10 rounded-lg p-1">
              {(["all", "error", "warn", "success"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeFilter === filter 
                      ? "bg-white/10 text-white shadow" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button className="px-3 py-2 bg-[#121212] border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white" title="Export Logs">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 md:px-8 pb-8 overflow-hidden">
          <div className="h-full bg-[#050505] border border-white/10 rounded-xl shadow-2xl overflow-y-auto font-mono text-[11px] leading-relaxed relative">
            
            {filteredLogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-600">
                No logs match your current filters.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.02]">
                {filteredLogs.map((log) => {
                  const isError = log.level === "error";
                  const isWarn = log.level === "warn";
                  
                  return (
                    <div 
                      key={log.id} 
                      className={`flex items-start gap-4 px-4 py-2 hover:bg-white/[0.03] transition-colors group ${
                        isError ? "bg-rose-500/[0.02]" : ""
                      }`}
                    >
                      {/* FIX 2: Removed fractionalSecondDigits so it compiles on older TS setups */}
                      <span className="text-gray-600 whitespace-nowrap shrink-0 mt-0.5">
                        {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      
                      <span className={`shrink-0 w-14 font-bold ${
                        isError ? "text-rose-500" :
                        isWarn ? "text-amber-500" :
                        log.level === "success" ? "text-emerald-500" : "text-blue-500"
                      }`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      
                      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-2 min-w-0">
                        <span className={`${isError ? "text-rose-100" : "text-gray-300"} break-words`}>
                          {log.message}
                        </span>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-0 shrink-0">
                          {log.latency && (
                            <span className={`px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] ${
                              log.latency > 2000 ? "text-rose-400" : "text-gray-400"
                            }`}>
                              {log.latency}ms
                            </span>
                          )}
                          {log.traceId && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px]">
                              {log.traceId.split('-')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-gray-600 hidden lg:block w-32 truncate text-right">
                          {log.source}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(JSON.stringify(log))}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"
                          title="Copy JSON"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}