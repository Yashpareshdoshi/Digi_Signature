import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Percent,
  RefreshCw,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  Zap,
  Activity,
  Scale,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [threatDist, setThreatDist] = useState<{ threats: any[]; decisions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, threatRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getThreatDistribution(),
      ]);
      setSummary(sumRes);
      setThreatDist(threatRes);
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

  const pipelineSteps = [
    { name: 'MESSAGE', desc: 'Plaintext Contract', icon: Lock },
    { name: 'SHA-256 + NONCE', desc: 'Integrity Token', icon: Database },
    { name: 'QUANTUM SIGNATURE', desc: 'Qubit State Preparation', icon: Cpu },
    { name: 'TELEPORTATION', desc: 'Bell Pair Channel', icon: Zap },
    { name: 'MEASUREMENT', desc: 'Projective Collapse', icon: Activity },
    { name: 'QBER ANALYSIS', desc: 'Wilson 95% CI', icon: Percent },
    { name: 'DECISION LEDGER', desc: 'Deterministic 6 Rules', icon: Scale },
    { name: 'SECURITY RESULT', desc: 'Verified / Blocked', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Security Command Center */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Quantum Digital Signature Security
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              Command Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Teleportation-based QDS with deterministic cyber-threat detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <NavLink
            to="/simulator"
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Launch Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Useful KPIs (No Duplicates) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Verifications</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {summary?.total_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Sessions evaluated
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            {summary?.verified_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            100% Genuine
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">
            {summary?.suspicious_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Above T_low (5%)
          </div>
        </div>

        <div className="cyber-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">
            {summary?.rejected_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Violated rules
          </div>
        </div>

        <div className="cyber-card col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">
            {summary?.active_alerts || 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Incident alerts
          </div>
        </div>
      </div>

      {/* Security Pipeline Visual Flow */}
      <div className="cyber-card">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3.5">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>End-to-End Quantum Security Pipeline</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Zero AI/ML Architecture</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {pipelineSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/90 text-center flex flex-col items-center justify-between"
              >
                <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-1.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-200 leading-tight">
                  {s.name}
                </span>
                <span className="text-[9px] text-slate-500 mt-1 leading-tight">
                  {s.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Status Pie */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Verification Decisions
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Backend Telemetry</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {decisionPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={74}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {decisionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d18', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-500">No verification data yet.</span>
            )}
          </div>
        </div>

        {/* Threat Distribution Bar Chart */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Threats Intercepted
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Classification</span>
          </div>

          <div className="h-56 w-full">
            {threatDist?.threats && threatDist.threats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatDist.threats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d18', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Caught" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                No threat logs recorded.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recent Activity
            </h2>
            <NavLink to="/verification" className="text-[11px] text-cyan-400 hover:underline">
              View All
            </NavLink>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1 flex-1">
            {summary?.recent_verifications && summary.recent_verifications.length > 0 ? (
              summary.recent_verifications.map((v) => (
                <div
                  key={v.session_id}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300 text-[11px] font-semibold">{v.session_id}</span>
                      <DecisionBadge decision={v.decision} size="sm" />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {v.threat_detected === 'NONE' ? 'Clean verification' : `Threat: ${v.threat_detected}`}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>QBER: {v.error_rate_pct.toFixed(1)}%</div>
                    <div className="text-slate-500">{new Date(v.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-slate-500 py-10">No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
