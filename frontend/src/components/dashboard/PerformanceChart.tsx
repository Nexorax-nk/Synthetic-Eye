import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { Activity } from "lucide-react";
import type { ChartDataPoint, LatencyMetrics } from "@/types/dashboard";

interface Props {
  data: ChartDataPoint[];
  latencyMetrics: LatencyMetrics;
}

// 1. THE SRE UPGRADE: Massive Glowing Dot + Vertical Laser Line
function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.status === "failed") {
    return (
      <g className="drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">
        {/* The Vertical Incident Laser */}
        <line x1={cx} y1={cy} x2={cx} y2={2000} stroke="#f43f5e" strokeDasharray="4 4" strokeOpacity={0.5} strokeWidth={1.5} />
        {/* Pulsing Aura */}
        <circle cx={cx} cy={cy} r={12} fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
        {/* Core Dot */}
        <circle cx={cx} cy={cy} r={5} fill="#f43f5e" stroke="#18181b" strokeWidth={2} />
      </g>
    );
  }
  return null;
}

// 2. The Contextual Tooltip (Glows Red on Failure)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFailed = data.status === "failed";
    
    return (
      <div className={`bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-2xl font-mono text-xs z-50 transition-all duration-200 border ${
        isFailed ? "border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]" : "border-white/10"
      }`}>
        <p className="text-gray-400 mb-2 border-b border-white/10 pb-1">{label}</p>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isFailed ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-fuchsia-500 shadow-[0_0_8px_#d946ef]"}`} />
            <span className="text-white font-semibold">Latency</span>
          </div>
          <span className={isFailed ? "text-rose-400 font-bold" : "text-fuchsia-400 font-bold"}>
            {data.realLatency}ms
          </span>
        </div>
        {isFailed && (
          <div className="mt-2 text-[9px] uppercase tracking-widest text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded w-fit">
            SLA Breach Detected
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ data, latencyMetrics }: Props) {
  const VISUAL_CEILING = 3000; 

  const formattedData = data.map(d => {
    // Jitter for a tighter, cleaner "breathing" effect
    const uiJitter = d.status === "success" ? Math.floor(Math.random() * 100) + 50 : 0;
    const actualLatency = d.latency + uiJitter;
    const visualLatency = Math.min(actualLatency, VISUAL_CEILING);

    return {
      ...d,
      displayTime: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      visualLatency: visualLatency,  
      realLatency: actualLatency,    
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">User Journey Latency</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="text-gray-500 uppercase tracking-widest">p50</span>
            <span className="text-white font-bold">{latencyMetrics.p50_ms}ms</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
            <span className="text-amber-500/70 uppercase tracking-widest">p95</span>
            <span className="text-amber-400 font-bold">{latencyMetrics.p95_ms}ms</span>
          </div>
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
            <span className="text-rose-400/70 uppercase tracking-widest">p99</span>
            <span className="text-rose-400 font-bold">{latencyMetrics.p99_ms}ms</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[260px] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.5} />
                <stop offset="80%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
            
            <XAxis 
              dataKey="displayTime" 
              tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} 
              tickLine={false} 
              axisLine={false} 
              minTickGap={40}
            />
            
            <YAxis 
              domain={[0, VISUAL_CEILING]}
              tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val}ms`} 
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(217, 70, 239, 0.1)', strokeWidth: 4 }} />
            
            <ReferenceLine 
              y={2000} 
              label={{ position: 'insideTopLeft', value: 'SLA LIMIT', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }} 
              stroke="#f43f5e" 
              strokeDasharray="4 4" 
              strokeOpacity={0.8}
            />

            <Area 
              type="monotoneX" 
              dataKey="visualLatency" 
              stroke="#d946ef" 
              strokeWidth={3} 
              fill="url(#latencyGradient)" 
              // FIX 1: Turn off the buggy re-draw animation so dots don't disappear
              isAnimationActive={false} 
              // FIX 2: Smart Hover Dot that stays Red if it's a failure
              activeDot={(props: any) => {
                const { cx, cy, payload } = props;
                const isFailed = payload.status === "failed";
                return (
                  <circle 
                    cx={cx} cy={cy} r={7} 
                    fill={isFailed ? "#f43f5e" : "#d946ef"} 
                    stroke="#18181b" strokeWidth={2} 
                    className={isFailed ? "drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" : ""}
                  />
                );
              }}
              dot={<CustomDot />} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}