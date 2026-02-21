import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { TerminalSquare, AlertTriangle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Route resolution failed for:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-gray-100 font-sans p-6 overflow-hidden relative">
      
      {/* --- DECORATIVE BACKGROUND GLOW --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
        
        {/* --- GLITCHY 404 HEADER --- */}
        <div className="flex items-center justify-center mb-4 relative">
          <h1 className="text-[120px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_40px_rgba(244,63,94,0.2)]">
            404
          </h1>
          <AlertTriangle className="absolute -right-8 top-0 w-12 h-12 text-rose-500 animate-pulse opacity-80" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-2 text-center">
          Endpoint Not Found
        </h2>
        
        <p className="text-gray-400 text-center mb-8 max-w-sm text-sm">
          The telemetry routing engine could not resolve the requested path across any active clusters.
        </p>

        {/* --- TERMINAL DIAGNOSTIC PANEL --- */}
        <div className="w-full bg-[#050505] border border-white/10 rounded-xl p-5 mb-8 shadow-2xl relative overflow-hidden">
          {/* Left Red Border Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50" />
          
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
            <TerminalSquare className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Trace Diagnostic</span>
          </div>
          
          <div className="font-mono text-xs leading-relaxed">
            <span className="text-gray-500">$</span> <span className="text-blue-400">resolve_route</span> --path <span className="text-emerald-400">"{location.pathname}"</span>
            <br />
            <span className="text-rose-500 font-bold">ERR_NOT_FOUND</span>: No matching handler mapped to this URI.
            <br />
            <span className="text-gray-500 mt-3 block">Action: Awaiting manual redirection to Command Center...</span>
          </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => window.history.back()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link 
            to="/" 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;