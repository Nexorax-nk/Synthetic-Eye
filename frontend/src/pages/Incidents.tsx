import Sidebar from "@/components/Sidebar";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

const Incidents = () => {
  const incidents = [
    { id: "INC-001", title: "Login Flow Timeout", severity: "critical", status: "open", time: "5 min ago", duration: "5m" },
    { id: "INC-002", title: "Checkout High Latency", severity: "warning", status: "investigating", time: "15 min ago", duration: "15m" },
    { id: "INC-003", title: "Search API Error", severity: "critical", status: "resolved", time: "1 hour ago", duration: "45m" },
    { id: "INC-004", title: "Cart Update Failed", severity: "warning", status: "resolved", time: "2 hours ago", duration: "30m" },
    { id: "INC-005", title: "Payment Gateway Slow", severity: "info", status: "monitoring", time: "3 hours ago", duration: "1h 20m" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Incidents</h1>
              <p className="text-gray-400">Track and manage all monitoring incidents</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              Create Incident
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard icon={<AlertCircle />} label="Open" value="2" color="red" />
          <StatCard icon={<Clock />} label="Investigating" value="1" color="yellow" />
          <StatCard icon={<CheckCircle />} label="Resolved" value="2" color="green" />
          <StatCard icon={<Activity />} label="MTTR" value="38m" color="blue" />
        </div>

        {/* Incidents List */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Incidents</h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-6 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          incident.status === 'open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          incident.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {incident.time}
                        </span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                    incident.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    incident.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {incident.severity.toUpperCase()}
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
    red: 'from-red-500/20 to-red-500/10 border-red-500/30 text-red-400',
    yellow: 'from-yellow-500/20 to-yellow-500/10 border-yellow-500/30 text-yellow-400',
    green: 'from-green-500/20 to-green-500/10 border-green-500/30 text-green-400',
    blue: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400',
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

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default Incidents;
