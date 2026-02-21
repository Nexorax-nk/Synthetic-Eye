import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Activity, Play, Pause, CheckCircle2, XCircle, Clock, Globe, TerminalSquare } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export default function Monitors() {
  const { metrics } = useDashboardMetrics();
  
  // Local state to handle play/pause toggles for the UI
  const [pausedMonitors, setPausedMonitors] = useState<Set<number>>(new Set([3])); // Mock monitor 3 is paused by default
  const [now, setNow] = useState(new Date());

  // Update "last run" timer
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Synthesize our active Playwright script with the static mock data
  const monitors = useMemo(() => {
    const isFailing = (metrics?.global_health?.active_incidents_count || 0) > 0;
    const lastTraceTime = metrics?.chart_data?.length 
      ? new Date(metrics.chart_data[metrics.chart_data.length - 1].time) 
      : new Date();
    
    // Calculate seconds ago
    const secondsAgo = Math.floor((now.getTime() - lastTraceTime.getTime()) / 1000);
    const timeDisplay = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`;

    return [
      { 
        id: 1, 
        name: "Primary Checkout Flow", 
        script: "checkout.spec.ts",
        status: pausedMonitors.has(1) ? "paused" : (isFailing ? "failing" : "active"), 
        uptime: metrics?.global_health?.availability_pct || 100, 
        lastRun: timeDisplay, 
        location: "ap-south-1" 
      },
      { id: 2, name: "User Authentication", script: "login.spec.ts", status: pausedMonitors.has(2) ? "paused" : "active", uptime: 99.99, lastRun: "12s ago", location: "us-east-1" },
      { id: 3, name: "Search & Filtering API", script: "search.spec.ts", status: pausedMonitors.has(3) ? "paused" : "active", uptime: 98.2, lastRun: "Paused", location: "eu-central-1" },
      { id: 4, name: "Payment Gateway Webhook", script: "payment.spec.ts", status: pausedMonitors.has(4) ? "paused" : "active", uptime: 100, lastRun: "45s ago", location: "ap-northeast-1" },
    ];
  }, [metrics, pausedMonitors, now]);

  const stats = useMemo(() => {
    return {
      active: monitors.filter(m => m.status === 'active' || m.status === 'failing').length,
      passing: monitors.filter(m => m.status === 'active').length,
      failing: monitors.filter(m => m.status === 'failing').length,
      paused: monitors.filter(m => m.status === 'paused').length,
    };
  }, [monitors]);

  const toggleMonitor = (id: number) => {
    setPausedMonitors(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!metrics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <TerminalSquare className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-mono tracking-widest text-gray-400">CONNECTING TO RUNNERS...</p>
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
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
              <TerminalSquare className="w-6 h-6 text-emerald-400" />
              Synthetic Monitors
            </h1>
            <p className="text-sm text-gray-400 font-mono">Automated Playwright scripts executing globally</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20">
            + Deploy Script
          </button>
        </div>

        {/* --- KPI STATS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Activity />} label="Total Active" value={stats.active.toString()} color="blue" />
          <StatCard icon={<CheckCircle2 />} label="Passing" value={stats.passing.toString()} color="green" />
          <StatCard icon={<XCircle />} label="Failing" value={stats.failing.toString()} color="red" />
          <StatCard icon={<Pause />} label="Paused" value={stats.paused.toString()} color="gray" />
        </div>

        {/* --- MONITORS LIST --- */}
        <div className="bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Execution Fleet</h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {monitors.map((monitor) => {
              const isPaused = monitor.status === 'paused';
              const isFailing = monitor.status === 'failing';
              
              return (
                <div key={monitor.id} className={`p-5 transition-colors ${isPaused ? "opacity-60 bg-black/20" : "hover:bg-white/5"}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left Column: Identify */}
                    <div className="flex items-start gap-4">
                      {/* Status Indicator */}
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                        isPaused ? 'bg-gray-500' :
                        isFailing ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse' :
                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      }`} />
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-white">{monitor.name}</h3>
                          {monitor.id === 1 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Live Demo
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500">
                          <span className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                            <TerminalSquare className="h-3 w-3" />
                            {monitor.script}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {monitor.lastRun}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {monitor.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column: Metrics & Actions */}
                    <div className="flex items-center gap-8 pl-6 lg:pl-0">
                      <div className="text-right">
                        <div className={`text-xl font-bold font-mono ${isFailing && !isPaused ? "text-rose-400" : "text-white"}`}>
                          {typeof monitor.uptime === 'number' ? monitor.uptime.toFixed(2) : monitor.uptime}%
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Uptime</div>
                      </div>
                      
                      <div className="w-px h-8 bg-white/10 hidden sm:block" />
                      
                      <button 
                        onClick={() => toggleMonitor(monitor.id)}
                        className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                          isPaused 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                        title={isPaused ? "Resume Monitor" : "Pause Monitor"}
                      >
                        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UPDATED STAT CARD ---
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
  const colorClasses = {
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    red: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`border rounded-xl p-5 shadow-lg relative overflow-hidden ${colorClasses[color as keyof typeof colorClasses]}`}>
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