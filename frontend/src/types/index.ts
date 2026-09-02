export interface Signature {
  id: number;
  signature_id: string;
  message: string;
  message_hash: string;
  signer_id: string;
  bell_state: string;
  quantum_state: string;
  nonce: string;
  nonce_consumed: number;
  status: 'GENERATED' | 'VERIFIED' | 'SUSPICIOUS' | 'REJECTED' | 'ATTACKED';
  created_at: string;
}

export interface StatevectorData {
  num_qubits: number;
  dimension: number;
  basis_states: string[];
  probabilities: number[];
  amplitudes: Array<{ real: number; imag: number }>;
  bloch?: {
    theta: number;
    phi: number;
    theta_deg: number;
    phi_deg: number;
    x: number;
    y: number;
    z: number;
  };
}

export interface QuantumStep {
  step: number;
  name: string;
  description: string;
  circuit_gate: string;
  statevector?: StatevectorData;
  measured_bits?: string;
  outcome_probabilities?: Record<string, number>;
  bob_state_before_correction?: StatevectorData;
  pauli_correction?: string;
  recovered_state?: StatevectorData;
  fidelity?: number;
}

export interface TeleportationResult {
  bell_state_used: string;
  classical_bits: string;
  pauli_correction: string;
  input_state: StatevectorData;
  recovered_state: StatevectorData;
  fidelity: number;
  steps: QuantumStep[];
}

export interface MeasurementSample {
  shot_number: number;
  basis: string;
  expected_outcome: string;
  actual_outcome: string;
  probability: number;
  is_match: number;
}

export interface MeasurementResult {
  basis: string;
  shots: number;
  theoretical_probabilities: Record<string, number>;
  counts: Record<string, number>;
  expected_outcome: string;
  expected_count: number;
  unexpected_count: number;
  empirical_error_rate: number;
  empirical_accuracy: number;
  noise_applied: number;
  sample_records: MeasurementSample[];
}

export interface SignatureDetail extends Signature {
  teleportation_data?: TeleportationResult;
  measurement_summary?: MeasurementResult;
}

export interface StatisticalDetails {
  total_shots: number;
  unexpected_count: number;
  expected_count: number;
  error_rate: number;
  error_rate_percentage: number;
  confidence_lower: number;
  confidence_upper: number;
  confidence_interval_text: string;
  forgery_probability: number;
  forgery_probability_percentage: number;
  p_value_legitimate: number;
  low_threshold: number;
  high_threshold: number;
}

export interface RuleDetails {
  decision: 'VERIFIED' | 'SUSPICIOUS' | 'REJECTED';
  threat_detected: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  alert_title: string;
  reason: string;
  rule_triggered: string;
  confidence: string;
  action_recommended: string;
}

export interface VerificationSession {
  id: number;
  session_id: string;
  signature_id: string;
  verifier_id: string;
  signer_id: string;
  measurement_count: number;
  error_count: number;
  error_rate: number;
  forgery_probability: number;
  confidence_lower: number;
  confidence_upper: number;
  decision: 'VERIFIED' | 'SUSPICIOUS' | 'REJECTED';
  threat_detected: string;
  reason: string;
  latency_ms: number;
  created_at: string;
  statistical_details?: StatisticalDetails;
  rule_details?: RuleDetails;
  measurement_counts?: Record<string, number>;
}

export interface AttackRecord {
  id: number;
  attack_id: string;
  signature_id: string;
  attack_type: string;
  parameters?: string;
  measurement_error: number;
  detected: number;
  severity: string;
  reason: string;
  created_at: string;
  verification_session?: Partial<VerificationSession>;
  alert_generated?: Partial<AlertRecord>;
  comparison?: Record<string, any>;
}

export interface AlertRecord {
  id: number;
  alert_id: string;
  attack_id?: string;
  signature_id?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  threat_type: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_signatures: number;
  verified_signatures: number;
  rejected_signatures: number;
  suspicious_signatures: number;
  active_alerts: number;
  total_attacks_simulated: number;
  attacks_detected: number;
  detection_rate_pct: number;
  average_measurement_error_pct: number;
  average_forgery_probability_pct: number;
  recent_verifications: Array<{
    session_id: string;
    signature_id: string;
    decision: string;
    threat_detected: string;
    error_rate_pct: number;
    created_at: string;
  }>;
  recent_alerts: Array<{
    alert_id: string;
    title: string;
    severity: string;
    status: string;
    created_at: string;
  }>;
}

export interface DemoTraceStep {
  step: number;
  title: string;
  status: string;
  decision?: string;
  details: string;
}

export interface DemoResponse {
  signature_id: string;
  message: string;
  legitimate_verification: VerificationSession;
  simulated_attack: AttackRecord;
  alert?: AlertRecord;
  trace: DemoTraceStep[];
}
