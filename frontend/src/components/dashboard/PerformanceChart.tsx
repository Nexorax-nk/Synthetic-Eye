import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartDataPoint, LatencyMetrics } from "@/types/dashboard";

interface Props {
  data: ChartDataPoint[];
  latencyMetrics: LatencyMetrics;
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.status === "failed") {
    return (
      <circle cx={cx} cy={cy} r={5} fill="hsl(0, 90%, 63%)" stroke="hsl(0, 90%, 73%)" strokeWidth={2} />
    );
  }
  return null;
}

export function PerformanceChart({ data, latencyMetrics }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-foreground">User Journey Latency (ms)</h3>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="text-muted-foreground">
            P95: <span className="text-sre-blue font-semibold">{latencyMetrics.p95_ms}ms</span>
          </span>
          <span className="text-muted-foreground">
            P99: <span className="text-sre-orange font-semibold">{latencyMetrics.p99_ms}ms</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--sre-pink))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--sre-pink))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            unit="ms"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "4px",
              color: "hsl(var(--card-foreground))",
              fontSize: "11px",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="hsl(var(--sre-pink))"
            strokeWidth={2}
            fill="url(#latencyGradient)"
            dot={<CustomDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
