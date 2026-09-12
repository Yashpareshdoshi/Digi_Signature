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
import { useTheme } from '../context/ThemeContext';

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-wide">
              Quantum Digital Signature Security
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC] dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40 font-semibold">
              Command Center
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            Teleportation-based QDS with deterministic cyber-threat detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#475569] border border-[#CBD5E1] dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <NavLink
            to="/simulator"
            className="px-4 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950"
          >
            <span>Launch Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Useful KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="cyber-card border-t-2 border-t-[#0891B2] hover:border-[#0891B2] hover:shadow-[0_4px_16px_rgba(8,145,178,0.14)] dark:border-t-cyan-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-xs font-semibold">
            <span>Total Verifications</span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] dark:bg-cyan-950/60 dark:border-cyan-500/30 dark:text-cyan-400 flex items-center justify-center shadow-xs">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A] dark:text-white font-mono">
            {summary?.total_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2] dark:bg-cyan-500"></span>
            <span>Sessions evaluated</span>
          </div>
        </div>

        <div className="cyber-card border-t-2 border-t-[#16A34A] hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.14)] dark:border-t-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-xs font-semibold">
            <span>Verified</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] dark:bg-emerald-950/60 dark:border-emerald-500/30 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#16A34A] dark:text-emerald-400 font-mono">
            {summary?.verified_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] dark:bg-emerald-500"></span>
            <span>100% Genuine</span>
          </div>
        </div>

        <div className="cyber-card border-t-2 border-t-[#D97706] hover:border-[#D97706] hover:shadow-[0_4px_16px_rgba(217,119,6,0.14)] dark:border-t-amber-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-xs font-semibold">
            <span>Suspicious</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] dark:bg-amber-950/60 dark:border-amber-500/30 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#D97706] dark:text-amber-300 font-mono">
            {summary?.suspicious_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] dark:bg-amber-500"></span>
            <span>Above T_low (5%)</span>
          </div>
        </div>

        <div className="cyber-card border-t-2 border-t-[#DC2626] hover:border-[#DC2626] hover:shadow-[0_4px_16px_rgba(220,38,38,0.14)] dark:border-t-rose-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-xs font-semibold">
            <span>Rejected</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/60 dark:border-rose-500/30 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#DC2626] dark:text-rose-400 font-mono">
            {summary?.rejected_signatures || 0}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-rose-500"></span>
            <span>Violated rules</span>
          </div>
        </div>

        <div className="cyber-card border-t-2 border-t-[#DC2626] hover:border-[#DC2626] hover:shadow-[0_4px_16px_rgba(220,38,38,0.14)] dark:border-t-rose-600 col-span-2 md:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-xs font-semibold">
            <span>Active Threats</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/60 dark:border-rose-500/30 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#DC2626] dark:text-rose-400 font-mono">
            {summary?.active_alerts || 0}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-rose-600 animate-pulse"></span>
            <span>Incident alerts</span>
          </div>
        </div>
      </div>

      {/* Security Pipeline Visual Flow */}
      <div className="cyber-card">
        <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-slate-800/80 pb-2.5 mb-3.5">
          <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <span>End-to-End Quantum Security Pipeline</span>
          </h2>
          <span className="text-[10px] font-mono text-[#0891B2] bg-[#ECFEFF] border border-[#A5F3FC] dark:text-cyan-300 dark:bg-cyan-950 dark:border-cyan-500/30 px-2 py-0.5 rounded font-semibold">
            Zero AI/ML Architecture
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {pipelineSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-center flex flex-col items-center justify-between shadow-xs hover:border-[#0891B2] hover:bg-[#F0FDFF] hover:shadow-[0_4px_12px_rgba(8,145,178,0.12)] dark:bg-slate-950/80 dark:border-slate-800 dark:hover:border-cyan-500 dark:hover:bg-slate-900 transition-all group relative overflow-hidden"
              >
                <div className="text-[9px] font-mono font-bold text-[#94A3B8] dark:text-slate-500 self-end mb-1">
                  0{idx + 1}
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] text-[#0891B2] dark:bg-slate-900 dark:border-slate-800 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0F172A] dark:text-slate-200 leading-tight">
                  {s.name}
                </span>
                <span className="text-[9px] text-[#64748B] dark:text-slate-400 mt-1 leading-tight">
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
            <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider">
              Verification Decisions
            </h2>
            <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono">Backend Telemetry</span>
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
                    contentStyle={{
                      backgroundColor: isDark ? '#090d18' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDark ? '#f8fafc' : '#0F172A',
                      boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#64748B] dark:text-slate-400">No verification data yet.</span>
            )}
          </div>
        </div>

        {/* Threat Distribution Bar Chart */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider">
              Threats Intercepted
            </h2>
            <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono">Classification</span>
          </div>

          <div className="h-56 w-full">
            {threatDist?.threats && threatDist.threats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatDist.threats}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#E2E8F0'} />
                  <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94A3B8'} tick={{ fontSize: 9 }} />
                  <YAxis stroke={isDark ? '#64748b' : '#94A3B8'} tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#090d18' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDark ? '#f8fafc' : '#0F172A',
                      boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Caught" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[#64748B] dark:text-slate-400">
                No threat logs recorded.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="cyber-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider">
              Recent Activity
            </h2>
            <NavLink to="/verification" className="text-[11px] text-[#0891B2] hover:underline font-semibold dark:text-cyan-400">
              View All
            </NavLink>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1 flex-1">
            {summary?.recent_verifications && summary.recent_verifications.length > 0 ? (
              summary.recent_verifications.map((v) => (
                <div
                  key={v.session_id}
                  className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] dark:bg-slate-950/70 dark:border-slate-800/80 flex items-center justify-between text-xs transition-all shadow-xs hover:border-[#0891B2] hover:bg-[#F0FDFF] dark:hover:border-cyan-500/50"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#0F172A] dark:text-slate-200 text-[11px] font-semibold">{v.session_id}</span>
                      <DecisionBadge decision={v.decision} size="sm" />
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-slate-400">
                      {v.threat_detected === 'NONE' ? 'Clean verification' : `Threat: ${v.threat_detected}`}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-[#0F172A] dark:text-slate-300">
                    <div>QBER: {v.error_rate_pct.toFixed(1)}%</div>
                    <div className="text-[#64748B] dark:text-slate-400">{new Date(v.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-[#64748B] dark:text-slate-400 py-10">No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
