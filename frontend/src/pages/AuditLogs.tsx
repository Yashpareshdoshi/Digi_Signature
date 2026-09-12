import React, { useState, useEffect } from 'react';
import { ScrollText, Filter, Search, ShieldCheck, RefreshCw, Eye, X } from 'lucide-react';

interface AuditLogEntry {
  id: number;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: string;
  timestamp: string;
}

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionFilter && actionFilter !== 'ALL') params.append('action', actionFilter);
      if (userFilter && userFilter !== 'ALL') params.append('user_id', userFilter);

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [actionFilter, userFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Immutable Quantum Security Audit Logs & Provenance Trail</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Complete cryptographic audit trail recording every signature creation, quantum teleportation event, verification attempt, attack simulation, and incident resolution.
          </p>
        </div>

        <button
          onClick={loadAuditLogs}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-transparent text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="cyber-card flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Action:</span>
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 shadow-sm"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE_SIGNATURE">CREATE_SIGNATURE</option>
            <option value="VERIFY_SIGNATURE">VERIFY_SIGNATURE</option>
            <option value="SIMULATE_ATTACK">SIMULATE_ATTACK</option>
            <option value="UPDATE_ALERT_STATUS">UPDATE_ALERT_STATUS</option>
          </select>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 ml-2">
            <span>Actor / Principal:</span>
          </div>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 shadow-sm"
          >
            <option value="ALL">All Actors</option>
            <option value="Signer-Alice">Signer-Alice</option>
            <option value="Verifier-Bob">Verifier-Bob</option>
            <option value="Attacker-Sim">Attacker-Sim</option>
            <option value="Security-Operator">Security-Operator</option>
          </select>
        </div>

        <span className="text-slate-500 dark:text-slate-400">
          Showing {logs.length} audit record{logs.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="cyber-card overflow-hidden p-0 font-mono text-xs">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 text-[11px] sticky top-0 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Principal / Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Resource</th>
                <th className="p-3">Resource ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-transparent">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 text-slate-500">#{log.id}</td>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-300">{log.user_id}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border shadow-sm ${
                        log.action === 'CREATE_SIGNATURE'
                          ? 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30'
                          : log.action === 'VERIFY_SIGNATURE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/30'
                          : log.action === 'SIMULATE_ATTACK'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/30'
                          : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{log.resource}</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.resource_id || '—'}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedEntry(log)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-transparent text-[11px] flex items-center gap-1 ml-auto shadow-sm transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-[#0f1422] dark:border-cyan-500/40 dark:text-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 font-mono text-xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">
                Audit Record #{selectedEntry.id}
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Action:</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-bold">{selectedEntry.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Principal:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedEntry.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resource:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedEntry.resource} ({selectedEntry.resource_id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-600 dark:text-slate-400">{new Date(selectedEntry.timestamp).toISOString()}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[11px] font-bold block mb-1">Payload / Details:</span>
              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap shadow-inner">
                {selectedEntry.details
                  ? JSON.stringify(JSON.parse(selectedEntry.details), null, 2)
                  : 'No additional metadata logged.'}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-transparent transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
