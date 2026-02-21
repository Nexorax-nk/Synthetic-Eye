import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Key, 
  Users, 
  Save, 
  CheckCircle2,
  TerminalSquare,
  Copy
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock saving action
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const menuItems = [
    { id: "profile", label: "Personal Profile", icon: <User className="w-4 h-4" /> },
    { id: "team", label: "Team & Access", icon: <Users className="w-4 h-4" /> },
    { id: "api-keys", label: "Engine API Keys", icon: <Key className="w-4 h-4" /> },
    { id: "retention", label: "Data Retention", icon: <Database className="w-4 h-4" /> },
    { id: "alerts", label: "Global Alerts", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security & SAML", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-gray-100 font-sans">
      <div className="hidden md:block border-r border-white/5 bg-black/20">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full scroll-smooth flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
              <TerminalSquare className="w-6 h-6 text-purple-400" />
              Workspace Settings
            </h1>
            <p className="text-sm text-gray-400 font-mono">Manage synthetic engine preferences and access control</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              saved 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
            }`}
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved</>
            ) : isSaving ? (
              "Saving..."
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>

        {/* --- SPLIT PANE LAYOUT --- */}
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          
          {/* LEFT NAV */}
          <div className="w-full md:w-64 flex flex-col gap-1 shrink-0">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">
              Configuration
            </div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                    isActive 
                      ? "bg-white/10 text-white shadow-inner border border-white/5" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`${isActive ? "text-purple-400" : "opacity-70"}`}>
                    {item.icon}
                  </div>
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 max-w-4xl">
            {activeTab === "api-keys" && <ApiKeysPanel />}
            {activeTab === "retention" && <RetentionPanel />}
            {activeTab !== "api-keys" && activeTab !== "retention" && (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-black/20 text-center">
                <Shield className="w-8 h-8 text-gray-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-300">Configuration Locked</h3>
                <p className="text-sm font-mono text-gray-500 mt-2">You do not have administrative privileges to edit this section.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-PANEL: API KEYS (The SRE Flex) ---
function ApiKeysPanel() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-[#121212] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Playwright Engine API Keys</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">Use these keys to authenticate your CI/CD pipelines.</p>
          </div>
          <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white transition-colors">
            + Generate Key
          </button>
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Token</th>
                <th className="p-3 font-semibold">Last Used</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-3 font-semibold text-gray-300">Production Runner</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-xs">
                      syn_prod_8f92e...
                    </span>
                    <Copy className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                  </div>
                </td>
                <td className="p-3 text-xs font-mono text-gray-500">2 mins ago</td>
                <td className="p-3 text-right">
                  <button className="text-[10px] font-bold text-rose-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Revoke</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-3 font-semibold text-gray-300">Local Dev Testing</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 text-xs">
                      syn_dev_2a19b...
                    </span>
                    <Copy className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                  </div>
                </td>
                <td className="p-3 text-xs font-mono text-gray-500">3 days ago</td>
                <td className="p-3 text-right">
                  <button className="text-[10px] font-bold text-rose-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SUB-PANEL: RETENTION ---
function RetentionPanel() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-[#121212] border border-white/10 rounded-xl p-6 shadow-2xl">
        <h2 className="text-base font-bold text-white tracking-wide mb-1">Data Retention Policies</h2>
        <p className="text-xs text-gray-500 font-mono mb-6">Manage how long synthetic traces and Playwright screenshots are stored.</p>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Raw Trace Logs</label>
            <select className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:outline-none focus:border-purple-500 transition-colors">
              <option>7 Days</option>
              <option>14 Days</option>
              <option selected>30 Days (Default)</option>
              <option>90 Days</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Failure DOM Screenshots</label>
            <select className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:outline-none focus:border-purple-500 transition-colors">
              <option>3 Days</option>
              <option selected>7 Days (Default)</option>
              <option>14 Days</option>
            </select>
            <p className="text-[10px] text-amber-500/70 font-mono mt-1">Warning: Increasing screenshot retention will heavily impact database storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}