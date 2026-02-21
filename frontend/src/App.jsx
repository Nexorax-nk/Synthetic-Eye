import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Zap,
  X,
  Target
} from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/dashboard/metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerChaos = async () => {
    setTriggering(true);
    try {
      await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        headers: {
          'x-kill-switch': 'true'
        }
      });
    } catch (err) {
      console.error("Failed to trigger chaos", err);
    }
    setTimeout(() => setTriggering(false), 2000);
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-[#58A6FF] font-bold text-xl tracking-widest uppercase">
        <Activity className="animate-spin mr-3" /> Initializing Telemetry...
      </div>
    );
  }

  const {
    global_health,
    sla_error_budget,
    latency_metrics,
    chart_data,
    incident_panel,
    http_status_breakdown
  } = metrics;

  const isOperational = global_health?.system_status === 'Operational';

  // Custom DOT for chart failures
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.status === 'failed') {
      return (
        <circle cx={cx} cy={cy} r={4} fill="#F85149" stroke="none" />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-sre-bg text-gray-300 p-4 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-sre-border pb-4">
        <div className="flex items-center space-x-3">
          <Target className="text-sre-blue h-8 w-8" />
          <h1 className="text-2xl font-bold text-white tracking-widest">SENTINEL-OS</h1>
        </div>
        <button
          onClick={triggerChaos}
          disabled={triggering}
          className={`flex items-center px-4 py-2 rounded font-bold text-sm tracking-widest transition-colors ${triggering
              ? 'bg-sre-border text-gray-400 cursor-not-allowed'
              : 'bg-sre-red bg-opacity-20 text-sre-red border border-sre-red hover:bg-sre-red hover:text-white'
            }`}
        >
          <Zap className="h-4 w-4 mr-2" />
          {triggering ? 'INJECTING FAULT...' : 'TRIGGER FAULT INJECTION'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content (Left) */}
        <div className="col-span-12 xl:col-span-9 space-y-6">

          {/* Zone 1: Global Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-sre-card border border-sre-border p-4 rounded-lg flex items-center justify-between shadow-lg">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">System Status</p>
                <div className={`text-lg font-bold flex items-center ${isOperational ? 'text-sre-green' : 'text-sre-red'}`}>
                  {isOperational ? 'OPERATIONAL' : 'DEGRADED'}
                  {isOperational ? (
                    <span className="relative flex h-3 w-3 ml-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sre-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sre-green"></span>
                    </span>
                  ) : (
                    <AlertTriangle className="h-4 w-4 ml-2 animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-sre-card border border-sre-border p-4 rounded-lg shadow-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Availability</p>
              <div className="text-2xl font-bold text-white">
                {global_health?.availability_pct}%
              </div>
            </div>

            <div className="bg-sre-card border border-sre-border p-4 rounded-lg shadow-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Error Rate</p>
              <div className={`text-2xl font-bold ${global_health?.error_rate_pct > 5 ? 'text-sre-red' : 'text-white'}`}>
                {global_health?.error_rate_pct}%
              </div>
            </div>

            <div className="bg-sre-card border border-sre-border p-4 rounded-lg shadow-lg flex flex-col justify-center">
              <div className="flex justify-between items-end mb-2">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Error Budget</p>
                <span className="text-sm font-bold text-sre-blue">{sla_error_budget?.budget_remaining_pct}%</span>
              </div>
              <div className="w-full bg-sre-border rounded-full h-2">
                <div
                  className="bg-sre-blue h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, sla_error_budget?.budget_remaining_pct || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Zone 2: Performance Telemetry */}
          <div className="bg-sre-card border border-sre-border p-4 rounded-lg shadow-lg relative h-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center">
                <Activity className="w-4 h-4 mr-2 text-sre-blue" />
                Performance Telemetry
              </h2>
              <div className="flex space-x-4 text-xs font-bold">
                <div className="flex flex-col items-end">
                  <span className="text-gray-500">P95 LATENCY</span>
                  <span className="text-sre-blue">{latency_metrics?.p95_ms}ms</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-500">P99 LATENCY</span>
                  <span className="text-sre-red">{latency_metrics?.p99_ms}ms</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart_data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#238636" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#238636" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#8b949e"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      if (typeof val === 'string' && val.length > 18) return val.substring(11, 19);
                      return val;
                    }}
                  />
                  <YAxis
                    stroke="#8b949e"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}ms`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#fff' }}
                    itemStyle={{ color: '#58A6FF' }}
                    labelStyle={{ color: '#8b949e' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    stroke="#238636"
                    fillOpacity={1}
                    fill="url(#colorLatency)"
                    isAnimationActive={false}
                    dot={<CustomDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Zone 4: Network Integrity */}
          <div className="bg-sre-card border border-sre-border p-4 rounded-lg shadow-lg">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center mb-4">
              <Server className="w-4 h-4 mr-2 text-sre-blue" />
              Network Integrity
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {http_status_breakdown && Object.entries(http_status_breakdown).map(([code, pct]) => {
                let colorClass = 'text-gray-400';
                if (code.startsWith('2')) colorClass = 'text-sre-green';
                else if (code.startsWith('4')) colorClass = 'text-orange-400';
                else if (code.startsWith('5')) colorClass = 'text-sre-red';

                return (
                  <div key={code} className="bg-sre-bg border border-sre-border p-3 rounded flex justify-between items-center">
                    <span className="font-bold text-gray-500">HTTP {code}</span>
                    <span className={`font-bold text-lg ${colorClass}`}>{pct}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Zone 3: Incident Command (Right Sidebar) */}
        <div className="col-span-12 xl:col-span-3">
          <div className="bg-sre-card border border-sre-border rounded-lg shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-sre-border">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-sre-red" />
                Incident Command
              </h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[800px] space-y-3">
              {incident_panel?.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-10 flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-sre-green mb-2 opacity-50" />
                  No Active Incidents
                </div>
              ) : (
                incident_panel?.map((inc, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIncident(inc)}
                    className="bg-sre-bg border border-sre-border p-3 rounded cursor-pointer hover:border-sre-red transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-white bg-sre-red bg-opacity-20 text-sre-red px-2 py-0.5 rounded border border-sre-red">
                        HIGH SEV
                      </span>
                      <span className="text-xs text-gray-500 font-mono">#{inc.incident_id?.substring(0, 8)}</span>
                    </div>
                    <div className="font-bold text-sm text-gray-300 group-hover:text-white mb-1">
                      {inc.flow_name}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(inc.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal Overlay */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-sre-card border border-sre-red w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">

            <div className="flex justify-between items-center p-4 border-b border-sre-border bg-sre-red bg-opacity-10">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-sre-red mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-white">Incident Report: {selectedIncident.incident_id}</h3>
                  <p className="text-xs text-gray-400 font-mono">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {/* Step Breakdown */}
              <div className="border border-sre-border rounded overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sre-border bg-opacity-50 text-gray-300 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Step Name</th>
                      <th className="px-4 py-3 text-right">Latency</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sre-border bg-sre-bg">
                    {selectedIncident.step_breakdown?.map((step, idx) => (
                      <tr key={idx} className="hover:bg-sre-card transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-300">{step.step_name}</td>
                        <td className="px-4 py-3 text-right font-mono text-sre-blue">{step.latency}ms</td>
                        <td className="px-4 py-3 text-center">
                          {step.status === 'success' ? (
                            <span className="inline-block px-2 py-1 bg-sre-green bg-opacity-20 text-sre-green rounded text-xs tracking-wider">SUCCESS</span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-sre-red bg-opacity-20 text-sre-red rounded text-xs tracking-wider">FAILED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Error Stack */}
              {selectedIncident.error_stack && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Stack Trace</h4>
                  <pre className="bg-[#0D1117] border border-sre-border p-4 rounded text-sre-red text-xs overflow-x-auto font-mono leading-relaxed">
                    {selectedIncident.error_stack}
                  </pre>
                </div>
              )}

              {/* Screenshot */}
              {selectedIncident.screenshot_base64 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Failure Evidence</h4>
                  <div className="border border-sre-border rounded overflow-hidden shadow-lg">
                    <img
                      src={`data:image/png;base64,${selectedIncident.screenshot_base64}`}
                      alt="Error Screenshot"
                      className="w-full h-auto object-contain bg-black"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
