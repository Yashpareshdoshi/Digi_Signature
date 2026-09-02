import {
  Signature,
  SignatureDetail,
  VerificationSession,
  AttackRecord,
  AlertRecord,
  SystemSetting,
  DashboardSummary,
  DemoResponse,
  TeleportationResult,
  MeasurementResult
} from '../types';

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorDetail = `Error ${res.status}: ${res.statusText}`;
    try {
      const errObj = await res.json();
      errorDetail = errObj.detail || errObj.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  // Signatures
  createSignature: (payload: {
    message: string;
    signer_id?: string;
    bell_state?: string;
    quantum_state?: string;
    measurement_basis?: string;
    shots?: number;
  }): Promise<SignatureDetail> => fetchJSON('/signatures', { method: 'POST', body: JSON.stringify(payload) }),

  listSignatures: (skip = 0, limit = 50): Promise<Signature[]> =>
    fetchJSON(`/signatures?skip=${skip}&limit=${limit}`),

  getSignature: (id: string): Promise<Signature> => fetchJSON(`/signatures/${id}`),

  // Quantum
  getStates: (): Promise<any[]> => fetchJSON('/quantum/states'),
  getBellStates: (): Promise<any[]> => fetchJSON('/quantum/bell-states'),
  createBellState: (name: string): Promise<any> =>
    fetchJSON('/quantum/bell-state', { method: 'POST', body: JSON.stringify({ name }) }),
  runTeleportation: (payload: {
    quantum_state?: string;
    bell_state?: string;
    force_measurement_bits?: string;
  }): Promise<TeleportationResult> => fetchJSON('/quantum/teleport', { method: 'POST', body: JSON.stringify(payload) }),
  runMeasurement: (payload: {
    quantum_state?: string;
    basis?: string;
    shots?: number;
    noise_rate?: number;
  }): Promise<MeasurementResult> => fetchJSON('/quantum/measure', { method: 'POST', body: JSON.stringify(payload) }),

  // Verification
  startVerification: (payload: {
    signature_id: string;
    verifier_id?: string;
    claimed_signer_id?: string;
    custom_message?: string;
    shots?: number;
    noise_rate?: number;
    simulate_nonce_reuse?: boolean;
    low_threshold?: number;
    high_threshold?: number;
  }): Promise<VerificationSession> => fetchJSON('/verification/start', { method: 'POST', body: JSON.stringify(payload) }),

  listVerifications: (skip = 0, limit = 50): Promise<VerificationSession[]> =>
    fetchJSON(`/verification?skip=${skip}&limit=${limit}`),

  getVerification: (sessionId: string): Promise<VerificationSession> =>
    fetchJSON(`/verification/${sessionId}`),

  // Attacks
  simulateAttack: (payload: {
    attack_type: string;
    signature_id?: string;
    noise_level?: number;
    forged_signer?: string;
    shots?: number;
  }): Promise<AttackRecord> => fetchJSON('/attacks/simulate', { method: 'POST', body: JSON.stringify(payload) }),

  listAttacks: (skip = 0, limit = 50): Promise<AttackRecord[]> =>
    fetchJSON(`/attacks?skip=${skip}&limit=${limit}`),

  // Alerts
  listAlerts: (status?: string, severity?: string): Promise<AlertRecord[]> => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (severity && severity !== 'ALL') params.append('severity', severity);
    return fetchJSON(`/alerts?${params.toString()}`);
  },
  patchAlert: (alertId: string, status: string): Promise<AlertRecord> =>
    fetchJSON(`/alerts/${alertId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Dashboard & Analytics
  getDashboardSummary: (): Promise<DashboardSummary> => fetchJSON('/dashboard/summary'),
  getThreatDistribution: (): Promise<{ threats: any[]; decisions: any[] }> =>
    fetchJSON('/dashboard/threat-distribution'),
  getTimeline: (): Promise<any[]> => fetchJSON('/dashboard/timeline'),
  getMeasurementDistribution: (): Promise<any[]> => fetchJSON('/dashboard/measurement-distribution'),
  getAnalyticsMetrics: (): Promise<any> => fetchJSON('/analytics/metrics'),
  getAttackComparison: (): Promise<any[]> => fetchJSON('/analytics/attack-comparison'),
  getShotsBenchmark: (): Promise<any[]> => fetchJSON('/analytics/shots-benchmark'),

  // Settings
  getSettings: (): Promise<SystemSetting[]> => fetchJSON('/settings'),
  updateSetting: (key: string, value: string, description?: string): Promise<SystemSetting> =>
    fetchJSON(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ key, value, description }) }),
  resetSettings: (): Promise<SystemSetting[]> => fetchJSON('/settings/reset', { method: 'POST' }),

  // Demo
  runCompleteDemo: (params?: {
    message?: string;
    bell_state?: string;
    quantum_state?: string;
    attack_type?: string;
  }): Promise<DemoResponse> => {
    const q = new URLSearchParams();
    if (params?.message) q.append('message', params.message);
    if (params?.bell_state) q.append('bell_state', params.bell_state);
    if (params?.quantum_state) q.append('quantum_state', params.quantum_state);
    if (params?.attack_type) q.append('attack_type', params.attack_type);
    return fetchJSON(`/demo/run-complete?${q.toString()}`, { method: 'POST' });
  },
};
