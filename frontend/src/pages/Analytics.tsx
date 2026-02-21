import Sidebar from "@/components/Sidebar";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Performance insights and trends across all monitors</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KPICard 
            label="Avg Response Time" 
            value="245ms" 
            change="-12%" 
            trend="down" 
          />
          <KPICard 
            label="Success Rate" 
            value="99.2%" 
            change="+0.5%" 
            trend="up" 
          />
          <KPICard 
            label="Total Requests" 
            value="1.2M" 
            change="+8%" 
            trend="up" 
          />
          <KPICard 
            label="Error Rate" 
            value="0.8%" 
            change="-0.3%" 
            trend="down" 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <ChartCard title="Response Time Trend" />
          <ChartCard title="Success Rate Over Time" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="Geographic Distribution" />
          <ChartCard title="Top Slowest Endpoints" />
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, change, trend }: { label: string; value: string; change: string; trend: 'up' | 'down' }) => {
  const isPositive = (trend === 'up' && !change.startsWith('-')) || (trend === 'down' && change.startsWith('-'));
  
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {change}
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title }: { title: string }) => (
  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <div className="h-64 flex items-center justify-center border border-white/5 rounded-xl bg-black/20">
      <Activity className="h-12 w-12 text-gray-600" />
    </div>
  </div>
);

export default Analytics;
