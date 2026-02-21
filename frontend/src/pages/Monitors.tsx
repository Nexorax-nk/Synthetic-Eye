import Sidebar from "@/components/Sidebar";
import { Activity, Play, Pause, CheckCircle, XCircle, Clock, Globe } from "lucide-react";

const Monitors = () => {
  const monitors = [
    { id: 1, name: "Login Flow", status: "active", uptime: 99.9, lastRun: "2 min ago", location: "US-East" },
    { id: 2, name: "Checkout Process", status: "active", uptime: 99.5, lastRun: "5 min ago", location: "EU-West" },
    { id: 3, name: "Cart Operations", status: "paused", uptime: 98.2, lastRun: "1 hour ago", location: "Asia-Pacific" },
    { id: 4, name: "Search Functionality", status: "active", uptime: 99.8, lastRun: "1 min ago", location: "US-West" },
    { id: 5, name: "User Registration", status: "failing", uptime: 95.1, lastRun: "3 min ago", location: "US-East" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Synthetic Monitors</h1>
              <p className="text-gray-400">Automated user flow monitoring across all regions</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              + New Monitor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Activity />} label="Active Monitors" value="4" color="green" />
          <StatCard icon={<CheckCircle />} label="Passing" value="3" color="green" />
          <StatCard icon={<XCircle />} label="Failing" value="1" color="red" />
          <StatCard icon={<Pause />} label="Paused" value="1" color="yellow" />
        </div>

        {/* Monitors List */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">All Monitors</h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {monitors.map((monitor) => (
              <div key={monitor.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      monitor.status === 'active' ? 'bg-green-400 shadow-lg shadow-green-400/50' :
                      monitor.status === 'failing' ? 'bg-red-400 shadow-lg shadow-red-400/50' :
                      'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                    }`} />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{monitor.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {monitor.lastRun}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {monitor.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{monitor.uptime}%</div>
                      <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                    
                    <div className="flex gap-2">
                      {monitor.status === 'paused' ? (
                        <button className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                          <Play className="h-5 w-5 text-green-400" />
                        </button>
                      ) : (
                        <button className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">
                          <Pause className="h-5 w-5 text-yellow-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
  const colorClasses = {
    green: 'from-green-500/20 to-green-500/10 border-green-500/30 text-green-400',
    red: 'from-red-500/20 to-red-500/10 border-red-500/30 text-red-400',
    yellow: 'from-yellow-500/20 to-yellow-500/10 border-yellow-500/30 text-yellow-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-xl border rounded-2xl p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="opacity-70">{icon}</div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

export default Monitors;
