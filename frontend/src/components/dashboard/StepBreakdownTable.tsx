import type { StepBreakdown } from "@/types/dashboard";

interface Props {
  steps: StepBreakdown[];
}

export function StepBreakdownTable({ steps }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Step-Level Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-1.5 pr-2">Name</th>
              <th className="text-right py-1.5 px-2">Latency</th>
              <th className="text-right py-1.5 pl-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-1.5 pr-2 text-foreground">{step.step_name}</td>
                <td className="py-1.5 px-2 text-right text-muted-foreground">{step.latency_ms}ms</td>
                <td className="py-1.5 pl-2 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${step.status === "passed" || step.status === "success"
                    ? "bg-sre-green/20 text-sre-green"
                    : step.status === "failed"
                      ? "bg-sre-red/20 text-sre-red"
                      : "bg-muted text-muted-foreground"
                    }`}>
                    {step.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
