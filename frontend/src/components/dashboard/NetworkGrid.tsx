import type { HttpStatusBreakdown } from "@/types/dashboard";

interface Props {
  breakdown: HttpStatusBreakdown;
}

function getStatusColor(code: string): string {
  const num = parseInt(code);
  if (num >= 200 && num < 300) return "text-sre-green";
  if (num >= 300 && num < 400) return "text-sre-blue";
  if (num >= 400 && num < 500) return "text-sre-orange";
  return "text-sre-red";
}

export function NetworkGrid({ breakdown }: Props) {
  const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Network Distribution</h3>
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([code, pct]) => (
          <div key={code} className="flex items-center justify-between bg-muted/40 rounded px-3 py-2">
            <span className={`text-sm font-mono font-bold ${getStatusColor(code)}`}>{code}:</span>
            <span className={`text-sm font-mono font-semibold ${getStatusColor(code)}`}>
              {typeof pct === "number" ? pct.toFixed(1) : pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
