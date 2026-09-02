import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  FileCheck,
  Percent,
  TrendingUp,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [threatDist, setThreatDist] = useState<{ threats: any[]; decisions: any[] } | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [measDist, setMeasDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, threatRes, timeRes, measRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getThreatDistribution(),
        api.getTimeline(),
        api.getMeasurementDistribution(),
      ]);
      setSummary(sumRes);
      setThreatDist(threatRes);
      setTimeline(timeRes);
      setMeasDist(measRes);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const DECISION_COLORS: Record<string, string> = {
    VERIFIED: '#10b981',
    SUSPICIOUS: '#f59e0b',
    REJECTED: '#ef4444',
  };

  const decisionPieData = threatDist?.decisions.map((d) => ({
    name: d.name,
    value: d.count,
    color: DECISION_COLORS[d.name] || '#64748b',
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner: Academic Context & Scientific Distinction */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-wide">
              Cybersecurity Operations & Quantum Telemetry Dashboard
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-mono">
              Research Prototype
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Deterministic, measurement-statistics-based cyber threat detection for teleportation-based Quantum Digital Signatures (Zero AI/ML).
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Signatures</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            {summary?.total_signatures || 0}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{summary?.verified_signatures || 0} Verified</span>
            <span>•</span>
            <span className="text-rose-400">{summary?.rejected_signatures || 0} Rejected</span>
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Attack Detection Rate</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
            {summary?.detection_rate_pct || 100}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {summary?.attacks_detected || 0} of {summary?.total_attacks_simulated || 0} Simulated Attacks Caught
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mean Quantum Error Rate</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-300 font-mono">
            {summary?.average_measurement_error_pct || 0}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Threshold: T_low = 5.0% | T_high = 15.0%
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Security Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-400 font-mono">
            {summary?.active_alerts || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across Forgery, Replay & Impersonation
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Verification Status Pie */}
        <div className="cyber-card flex flex-col">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Verification Decisions
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            {decisionPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {decisionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-500">No verification data yet.</span>
            )}
          </div>
        </div>

        {/* Chart 2: Quantum Measurement Error Timeline */}
        <div className="cyber-card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Measurement Error Rate Over Time (with Wilson 95% CI)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Recent 20 Sessions</span>
          </div>
          <div className="h-60 w-full">
            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 60]} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="error_rate_pct"
                    name="Error Rate (%)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ci_upper_pct"
                    name="95% CI Upper"
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                Awaiting telemetry records...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row of Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Threat Classification Distribution */}
        <div className="cyber-card">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Threat Classification Distribution
          </h3>
          <div className="h-60 w-full">
            {threatDist?.threats && threatDist.threats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatDist.threats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Occurrences" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                No threat logs recorded.
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Recent Security Incident Alerts
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">Live Stream</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-60 pr-1 flex-1">
            {summary?.recent_alerts && summary.recent_alerts.length > 0 ? (
              summary.recent_alerts.map((alt) => (
                <div
                  key={alt.alert_id}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{alt.title}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : alt.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {alt.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Alert ID: {alt.alert_id} • Status: {alt.status}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(alt.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-slate-500 py-10">No recent alerts.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
