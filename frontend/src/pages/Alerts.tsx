import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  Bell, 
  Mail, 
  Slack, 
  Webhook, 
  Plus, 
  Power, 
  Activity,
  CheckCircle2
} from "lucide-react";

// Define the shape of a real Alert Channel
interface AlertChannel {
  id: string;
  name: string;
  type: "email" | "slack" | "webhook";
  target: string; // The email, channel name, or URL
  status: "active" | "paused";
}

export default function Alerts() {
  // 1. Live State Management
  const [channels, setChannels] = useState<AlertChannel[]>([
    { id: "alt-1", name: "SRE Core Team", type: "email", target: "sre-alerts@company.com", status: "active" },
    { id: "alt-2", name: "Incident Response", type: "slack", target: "#prod-incidents", status: "active" },
    { id: "alt-3", name: "PagerDuty Trigger", type: "webhook", target: "https://events.pagerduty.com/...", status: "paused" },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  // 2. The Toggle Action
  const toggleStatus = (id: string) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === id) {
        return { ...channel, status: channel.status === "active" ? "paused" : "active" };
      }
      return channel;
    }));
  };

  // 3. The Test Action (Perfect for the live demo)
  const handleTestAlert = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f] text-gray-100 font-sans">
      <div className="hidden md:block border-r border-white/5 bg-black/20">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full scroll-smooth">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-400" />
              Alert Routing
            </h1>
            <p className="text-sm text-gray-400 font-mono">Configure SLA breach notification endpoints</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Endpoint
          </button>
        </div>

        {/* --- ALERT CHANNELS GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {channels.map((channel) => {
            const isActive = channel.status === "active";
            const isTesting = testingId === channel.id;

            return (
              <div 
                key={channel.id} 
                className={`flex flex-col p-5 rounded-xl border transition-all duration-300 ${
                  isActive ? "bg-[#121212] border-white/10 shadow-lg" : "bg-white/[0.02] border-white/5 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    
                    {/* Icon Box */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                      isActive ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-gray-500/10 border-gray-500/20 text-gray-500"
                    }`}>
                      {channel.type === 'email' && <Mail className="h-5 w-5" />}
                      {channel.type === 'slack' && <Slack className="h-5 w-5" />}
                      {channel.type === 'webhook' && <Webhook className="h-5 w-5" />}
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                        {channel.name}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{channel.target}</p>
                    </div>
                  </div>

                  {/* Status Toggle Button */}
                  <button 
                    onClick={() => toggleStatus(channel.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                      isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {isActive ? "Active" : "Paused"}
                  </button>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="text-[10px] font-mono text-gray-500">
                    ID: {channel.id}
                  </div>
                  
                  <button 
                    onClick={() => handleTestAlert(channel.id)}
                    disabled={!isActive || isTesting}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all ${
                      !isActive ? "opacity-0 pointer-events-none" :
                      isTesting ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {isTesting ? (
                      <>
                        <Activity className="w-3 h-3 animate-pulse" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Test Alert
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}