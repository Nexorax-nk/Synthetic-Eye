import { Globe, AlertCircle, CheckCircle2, ServerCrash } from "lucide-react";
import type { HttpStatusBreakdown } from "@/types/dashboard";

interface Props {
  breakdown: HttpStatusBreakdown;
}

// Enterprise Helper: Maps status codes to specific colors, glows, and icons
function getStatusConfig(code: string) {
  const num = parseInt(code);
  if (num >= 200 && num < 300) {
    return { color: "text-emerald-400", bg: "bg-emerald-500", icon: CheckCircle2 };
  }
  if (num >= 300 && num < 400) {
    return { color: "text-blue-400", bg: "bg-blue-500", icon: Globe };
  }
  if (num >= 400 && num < 500) {
    return { color: "text-amber-400", bg: "bg-amber-500", icon: AlertCircle };
  }
  // 500+ Critical Errors get a custom neon glow effect
  return { 
    color: "text-rose-400", 
    bg: "bg-rose-500", 
    icon: ServerCrash, 
    shadow: "shadow-[0_0_10px_rgba(244,63,94,0.6)]" 
  };
}

export function NetworkGrid({ breakdown }: Props) {
  // Safely parse the entries to numbers just in case the backend sent strings,
  // then sort them from highest percentage to lowest percentage.
  const entries = Object.entries(breakdown || {})
    .map(([code, pct]) => [code, typeof pct === 'string' ? parseFloat(pct) : pct] as [string, number])
    .sort(([, a], [, b]) => b - a);

  if (entries.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center border border-dashed border-white/10 rounded-lg">
        <span className="text-xs font-mono text-gray-500">Awaiting network telemetry...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([code, pct]) => {
        const { color, bg, icon: Icon, shadow } = getStatusConfig(code);
        
        return (
          <div key={code} className="flex flex-col gap-1.5 group">
            
            {/* Header: Icon + Code + Percentage */}
            <div className="flex justify-between items-center text-xs font-mono">
              <span className={`font-bold flex items-center gap-1.5 ${color} group-hover:brightness-125 transition-all`}>
                <Icon className="w-3.5 h-3.5 opacity-80" />
                HTTP {code}
              </span>
              <span className="text-gray-300 font-bold">{pct.toFixed(1)}%</span>
            </div>

            {/* Visual Distribution Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${bg} ${shadow || ''}`}
                // Use Math.max(pct, 1) so even a 0.1% error shows a tiny visible sliver
                style={{ width: `${Math.max(pct, 1)}%` }} 
              />
            </div>

          </div>
        );
      })}
    </div>
  );
}