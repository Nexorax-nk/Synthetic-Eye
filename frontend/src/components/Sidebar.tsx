import { Eye, LayoutDashboard, Activity, AlertCircle, Settings, BarChart3, FileText, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Activity, label: "Monitors", path: "/monitors" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: AlertCircle, label: "Incidents", path: "/incidents" },
    { icon: FileText, label: "Logs", path: "/logs" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1117] border-r border-white/5 flex flex-col backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Third Eye
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-purple-400" : "text-gray-400 group-hover:text-gray-300"
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group border border-transparent"
        >
          <Settings className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
          <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
