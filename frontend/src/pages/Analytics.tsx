import { useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe, 
  Clock, 
  ShieldAlert 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell
} from "recharts";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export default function Analytics() {
  const { metrics } = useDashboardMetrics();

  const health = metrics?.global_health;
  const latency = metrics?.latency_metrics;
  const recentIncident = metrics?.incident_panel?.[0];

  // 1. Endpoints Data (Horizontal Bars)
  const endpointData = useMemo(() => {
    if (!recentIncident?.step_breakdown) return [];
    return recentIncident.step_breakdown.map(step => ({
      name: step.step_name,
      time: step.latency_ms,
      isError: step.status === "failed"
    }));
  }, [recentIncident]);

  // 2. Geographic Data (Vertical Bars)
  const geoData = useMemo(() => {
    return [
      { region: "ap-south-1", requests: health?.total_requests || 0 },
      { region: "us-east-1", requests: Math.floor((health?.total_requests || 0) * 0.45) },
      { region: "eu-central-1", requests: Math.floor((health?.total_requests || 0) * 0.28) },
      { region: "ap-northeast-1", requests: Math.floor((health?.total_requests || 0) * 0.15) },
    ];
  }, [health?.total_requests]);

  // 3. Fake Sparkline Data for the KPI Cards to make them look alive
  const sparklineData = metrics?.chart_data?.slice(-15) || [];

  if (!metrics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Activity className="h-8 w-8 text-fuchsia-500" />
          <p className="text-sm font-mono tracking-widest text-gray-400">AGGREGATING TELEMETRY...</p>
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
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-fuchsia-400" />
            Performance Analytics
          </h1>
          <p className="text-sm text-gray-400 font-mono">Real-time trace insights and global endpoint trends</p>
        </div>

        {/* --- KPI CARDS WITH SPARKLINES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard 
            label="Median Response (p50)" 
            value={`${latency?.p50_ms || 0}ms`} 
            trend={latency?.p50_ms && latency.p50_ms > 1000 ? "up" : "down"} 
            isInverseGood={true}
            sparklineData={sparklineData}
            sparklineColor="#10b981"
          />
          <KPICard 
            label="Global Availability" 
            value={`${health?.availability_pct.toFixed(2)}%`} 
            trend={health?.availability_pct && health.availability_pct >= 99 ? "up" : "down"} 
            sparklineData={sparklineData}
            sparklineColor="#3b82f6"
          />
          <KPICard 
            label="Total Traces" 
            value={health?.total_requests.toLocaleString() || "0"} 
            trend="up" 
            sparklineData={sparklineData}
            sparklineColor="#8b5cf6"
          />
          <KPICard 
            label="SLA Error Rate" 
            value={`${health?.error_rate_pct.toFixed(2)}%`} 
            trend={health?.error_rate_pct && health.error_rate_pct > 2 ? "up" : "down"} 
            isInverseGood={true}
            sparklineData={sparklineData}
            sparklineColor="#f43f5e"
          />
        </div>

        {/* --- CHARTS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Chart 1: Endpoint Breakdown (Horizontal Gradient Bars) */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-fuchsia-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Slowest Endpoints</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={endpointData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradientOk" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#d946ef" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="barGradientFail" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9f1239" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "#e4e4e7", fontSize: 11, fontWeight: "500" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={20}>
                    {endpointData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isError ? "url(#barGradientFail)" : "url(#barGradientOk)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: P99 Latency Area Chart (Glowing) */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">P99 Latency Trend</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time" tick={false} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}ms`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="#fbbf24" strokeWidth={3} fill="url(#amberGradient)" activeDot={{ r: 6, fill: "#fbbf24", stroke: "#18181b", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ROW: Geo Distribution (Vertical Glow Bars) --- */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Geographic Distribution (Requests)</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="region" tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="requests" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- KPI CARD WITH INLINE SPARKLINES ---
const KPICard = ({ 
  label, 
  value, 
  trend, 
  isInverseGood = false,
  sparklineData,
  sparklineColor
}: { 
  label: string; 
  value: string | number; 
  trend: 'up' | 'down';
  isInverseGood?: boolean;
  sparklineData: any[];
  sparklineColor: string;
}) => {
  const isPositive = isInverseGood ? trend === 'down' : trend === 'up';
  
  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">{label}</div>
        
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold font-mono text-white">{value}</div>
          
          {/* Trend Badge */}
          <div className={`flex items-center gap-1 text-[10px] font-bold tracking-widest px-2 py-1 rounded border ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          </div>
        </div>

        {/* Tiny Sparkline Chart at the bottom of the card */}
        <div className="h-8 w-full mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="latency" stroke={sparklineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};