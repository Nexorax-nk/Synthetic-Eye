import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { StepBreakdown } from "@/types/dashboard";

interface Props {
  steps: StepBreakdown[];
}

export function StepBreakdownTable({ steps }: Props) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 border border-dashed border-white/10 rounded-lg">
        <span className="text-xs font-mono text-gray-500">Awaiting step trace data...</span>
      </div>
    );
  }

  // SRE MATH: Find the slowest step to scale our mini-waterfall bars
  const maxLatency = Math.max(...steps.map(s => s.latency_ms), 1);

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => {
        const isFailed = step.status === "failed";
        const isSuccess = step.status === "passed" || step.status === "success";
        
        // Calculate relative width for the visual bar (minimum 2% so fast steps are still visible)
        const widthPct = Math.max((step.latency_ms / maxLatency) * 100, 2);

        return (
          <div 
            key={i} 
            className="relative flex flex-col gap-2 p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/[0.04] transition-colors overflow-hidden group"
          >
            
            {/* 1. Subtle Background Highlight (The Waterfall Effect) */}
            <div 
              className={`absolute top-0 left-0 h-full opacity-10 transition-all duration-700 ${isFailed ? "bg-rose-500" : "bg-emerald-500"}`}
              style={{ width: `${widthPct}%` }}
            />

            {/* 2. The Main Content Row */}
            <div className="relative flex items-center justify-between z-10">
              {/* Step Name & Icon */}
              <div className="flex items-center gap-2">
                {isFailed ? (
                  <XCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                <span className={`text-xs font-bold tracking-wide ${isFailed ? 'text-rose-100' : 'text-gray-200'}`}>
                  {step.step_name}
                </span>
              </div>

              {/* Status Badge & Latency */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Clock className="w-3 h-3 opacity-50 text-gray-400" />
                  <span className={`font-bold ${isFailed ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {step.latency_ms}ms
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                  isFailed 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {step.status}
                </span>
              </div>
            </div>

            {/* 3. The Solid Progress Bar Line */}
            <div className="relative w-full h-1 bg-white/5 rounded-full mt-1 z-10 overflow-hidden">
               <div 
                className={`h-full rounded-full transition-all duration-700 ${isFailed ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-emerald-500"}`}
                style={{ width: `${widthPct}%` }}
               />
            </div>
          </div>
        );
      })}
    </div>
  );
}