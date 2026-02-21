import Sidebar from "@/components/Sidebar";
import { Bell, Mail, Slack, Webhook, Plus } from "lucide-react";

const Alerts = () => {
  const alertChannels = [
    { id: 1, name: "Email Notifications", type: "email", status: "active", recipients: 3 },
    { id: 2, name: "Slack #incidents", type: "slack", status: "active", recipients: 1 },
    { id: 3, name: "PagerDuty", type: "webhook", status: "paused", recipients: 1 },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Alert Channels</h1>
              <p className="text-gray-400">Configure how you receive incident notifications</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Channel
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {alertChannels.map((channel) => (
            <div key={channel.id} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    {channel.type === 'email' && <Mail className="h-6 w-6 text-purple-400" />}
                    {channel.type === 'slack' && <Slack className="h-6 w-6 text-purple-400" />}
                    {channel.type === 'webhook' && <Webhook className="h-6 w-6 text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                    <p className="text-sm text-gray-400">{channel.recipients} recipient(s)</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  channel.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {channel.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
