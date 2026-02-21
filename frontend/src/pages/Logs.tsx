import Sidebar from "@/components/Sidebar";
import { Search, Filter, Download, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";

const Logs = () => {
  const logs = [
    { time: "23:45:12", level: "error", message: "Login flow failed: Timeout after 30s", source: "login-monitor" },
    { time: "23:44:58", level: "warn", message: "High latency detected: 2.5s response time", source: "checkout-monitor" },
    { time: "23:44:45", level: "info", message: "Monitor execution completed successfully", source: "search-monitor" },
    { time: "23:44:30", level: "info", message: "Starting synthetic monitor run", source: "cart-monitor" },
    { time: "23:44:15", level: "error", message: "API endpoint returned 500 status code", source: "payment-monitor" },
    { time: "23:44:02", level: "warn", message: "Slow database query detected: 1.8s", source: "user-monitor" },
    { time: "23:43:50", level: "info", message: "Screenshot captured successfully", source: "login-monitor" },
    { time: "23:43:35", level: "success", message: "All health checks passed", source: "health-monitor" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Logs</h1>
          <p className="text-gray-400">Real-time monitoring logs and events</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Logs</h2>
          </div>
          
          <div className="font-mono text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                <span className="text-gray-500 whitespace-nowrap">{log.time}</span>
                
                <div className="flex items-center gap-2">
                  {log.level === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
                  {log.level === 'warn' && <AlertCircle className="h-5 w-5 text-yellow-400" />}
                  {log.level === 'info' && <Info className="h-5 w-5 text-blue-400" />}
                  {log.level === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                    log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                    log.level === 'success' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
                
                <span className="text-gray-300 flex-1">{log.message}</span>
                
                <span className="text-gray-500 text-xs whitespace-nowrap">{log.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
