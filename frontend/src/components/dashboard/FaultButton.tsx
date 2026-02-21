import { useState } from "react";
import { Zap } from "lucide-react";

export function FaultButton() {
  const [loading, setLoading] = useState(false);
  const [fired, setFired] = useState(false);

  const triggerFault = async () => {
    setLoading(true);
    try {
      // 1. Hit the dummy store's global chaos switch
      await fetch("http://localhost:5000/api/chaos", {
        method: "POST",
      });

      setFired(true);
      setTimeout(() => setFired(false), 3000);
    } catch (e) {
      console.error(e);
      setFired(true);
      setTimeout(() => setFired(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={triggerFault}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${fired
        ? "bg-sre-red/20 border-sre-red/50 text-sre-red"
        : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-sre-red/50 hover:bg-sre-red/10"
        } disabled:opacity-50`}
    >
      <Zap className="h-3.5 w-3.5" />
      {loading ? "Injecting…" : fired ? "Fault Injected" : "Trigger Fault Injection"}
    </button>
  );
}
