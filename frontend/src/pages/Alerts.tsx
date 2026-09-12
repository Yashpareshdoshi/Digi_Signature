import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Filter, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { api } from '../services/api';
import { AlertRecord } from '../types';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.listAlerts(statusFilter, severityFilter);
      setAlerts(data);
      if (data.length > 0 && !selectedAlert) {
        setSelectedAlert(data[0]);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter, severityFilter]);

  const handleStatusUpdate = async (alertId: string, newStatus: string) => {
    try {
      await api.patchAlert(alertId, newStatus);
      loadAlerts();
      if (selectedAlert && selectedAlert.alert_id === alertId) {
        setSelectedAlert({ ...selectedAlert, status: newStatus as any });
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/40';
      case 'HIGH':
        return 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/40';
      case 'MEDIUM':
        return 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/30';
      default:
        return 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-rose-950/70 dark:text-rose-400 dark:border-rose-500/30';
      case 'RESOLVED':
        return 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'INVESTIGATING':
        return 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] dark:bg-amber-950/70 dark:text-amber-400 dark:border-amber-500/30';
      default:
        return 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-wide">
              Security Incident Center
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40 font-bold">
              Audit Logs & Triage
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            Deterministic security alarms triggered by quantum measurement discrepancies, cryptographic replay attempts, and identity mismatches.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="cyber-card py-3 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono hover:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 shadow-xs transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-slate-400 ml-2">
            <span className="font-semibold">Severity:</span>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono hover:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 shadow-xs transition-colors"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div className="text-xs text-[#64748B] dark:text-slate-400 font-mono">
          Showing {alerts.length} incident record{alerts.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Incidents Table & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 cyber-card overflow-hidden p-0 border border-[#CBD5E1] hover:border-[#0891B2] dark:border-slate-800/90">
          <div className="overflow-x-auto max-h-[580px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-slate-950 dark:text-slate-400 text-[11px] sticky top-0 border-b border-[#CBD5E1] dark:border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Attack / Incident</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Evidence Vector</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-slate-800/80 bg-white dark:bg-[#0e1322]">
                {alerts.map((alt) => {
                  const isSelected = selectedAlert?.alert_id === alt.alert_id;
                  return (
                    <tr
                      key={alt.alert_id}
                      onClick={() => setSelectedAlert(alt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0FDFF] border-l-4 border-l-[#0891B2] dark:bg-cyan-950/40 dark:border-l-cyan-500 font-semibold'
                          : 'hover:bg-[#F8FAFC] dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="p-3 text-[#64748B] dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <div className="font-sans text-xs font-bold text-[#1E293B] dark:text-white">{alt.title}</div>
                        <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono mt-0.5">{alt.alert_id}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border shadow-xs ${getSeverityBadge(alt.severity)}`}>
                          {alt.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC] dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-500/30 px-2 py-0.5 rounded font-mono text-[11px] font-semibold inline-block">
                          {alt.threat_type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border shadow-xs ${getStatusBadge(alt.status)}`}>
                          {alt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Alert Details */}
        <div className="cyber-card flex flex-col justify-between space-y-4">
          {selectedAlert ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">Incident Inspection</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border shadow-xs ${getSeverityBadge(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white font-sans">{selectedAlert.title}</h3>
                <p className="text-xs text-[#475569] dark:text-slate-300 mt-1.5 font-sans leading-relaxed">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="cyber-subcard space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-slate-400">Incident ID:</span>
                  <span className="text-[#0F172A] dark:text-slate-200 font-semibold font-mono">{selectedAlert.alert_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-slate-400">Threat Vector:</span>
                  <span className="text-[#0891B2] dark:text-cyan-300 font-semibold font-mono">{selectedAlert.threat_type}</span>
                </div>
                {selectedAlert.signature_id && (
                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-slate-400">Target Signature:</span>
                    <span className="text-[#0F172A] dark:text-slate-200 font-mono">{selectedAlert.signature_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-slate-400">Current Status:</span>
                  <span className="text-[#EA580C] dark:text-amber-300 font-bold">{selectedAlert.status}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-semibold block">Update Incident Status:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.alert_id, 'INVESTIGATING')}
                    className="py-2 px-3 rounded-lg bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#EA580C] border border-[#FED7AA] dark:bg-amber-950/80 dark:hover:bg-amber-900 dark:text-amber-300 dark:border-amber-500/40 text-xs font-semibold transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.alert_id, 'RESOLVED')}
                    className="py-2 px-3 rounded-lg bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-950/80 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-semibold transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-32 font-mono">
              Select an alert from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
