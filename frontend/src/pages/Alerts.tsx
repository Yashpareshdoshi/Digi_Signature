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
        return 'bg-rose-950 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-indigo-950 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-rose-950/70 text-rose-400 border border-rose-500/30';
      case 'RESOLVED':
        return 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30';
      case 'INVESTIGATING':
        return 'bg-amber-950/70 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-slate-900 text-slate-400 border border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Security Incident Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
              Audit Logs & Triage
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic security alarms triggered by quantum measurement discrepancies, cryptographic replay attempts, and identity mismatches.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="cyber-card flex flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
            <span className="font-semibold">Severity:</span>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {alerts.length} incident record{alerts.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Incidents Table & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 cyber-card overflow-hidden p-0">
          <div className="overflow-x-auto max-h-[580px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[11px] sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Attack / Incident</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Evidence Vector</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {alerts.map((alt) => {
                  const isSelected = selectedAlert?.alert_id === alt.alert_id;
                  return (
                    <tr
                      key={alt.alert_id}
                      onClick={() => setSelectedAlert(alt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3 font-semibold text-slate-200">
                        <div className="font-sans text-xs">{alt.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{alt.alert_id}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alt.severity)}`}>
                          {alt.severity}
                        </span>
                      </td>
                      <td className="p-3 text-cyan-300 text-[11px]">
                        {alt.threat_type}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadge(alt.status)}`}>
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Incident Inspection</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white font-sans">{selectedAlert.title}</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Incident ID:</span>
                  <span className="text-slate-200">{selectedAlert.alert_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Threat Vector:</span>
                  <span className="text-cyan-300">{selectedAlert.threat_type}</span>
                </div>
                {selectedAlert.signature_id && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Signature:</span>
                    <span className="text-slate-200">{selectedAlert.signature_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="text-amber-300 font-bold">{selectedAlert.status}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 text-[10px] uppercase block">Update Incident Status:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.alert_id, 'INVESTIGATING')}
                    className="py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.alert_id, 'RESOLVED')}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
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
