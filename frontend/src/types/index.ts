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
  teleport_bits?: string;
  pauli_correction?: string;
  teleport_fidelity?: number;
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
  qiskit_circuit_diagram?: string;
  openqasm3?: string;
  backend?: string;
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
  likelihood_anomaly_score?: number;
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

export interface DecisionLedgerRule {
  id: string;
  name: string;
  condition: string;
  inputs?: Record<string, any>;
  status: 'PASS' | 'FAIL' | 'NOT REACHED';
  explanation: string;
}

export interface DecisionLedger {
  metadata?: {
    session_id?: string;
    signature_id?: string;
    signer_id?: string;
    verifier_id?: string;
    timestamp?: string;
  };
  classical_evidence?: {
    message_hash?: string;
    hash_comparison?: string;
    nonce?: string;
    nonce_freshness?: string;
    identity_authorization?: string;
  };
  quantum_evidence?: {
    token_pool_size?: number;
    signature_token_count?: number;
    sifted_token_count?: number;
    total_shots?: number;
    error_count?: number;
    empirical_qber?: number;
    wilson_ci_lower?: number;
    wilson_ci_upper?: number;
    wilson_ci_text?: string;
    active_threshold_low?: number;
    active_threshold_high?: number;
    forgery_likelihood?: number;
  };
  rules?: DecisionLedgerRule[];
  final_decision?: {
    decision?: string;
    threat_detected?: string;
    severity?: string;
    reason?: string;
    action_recommended?: string;
  };
}

export interface QDSTokenDetail {
  index: number;
  sifted: boolean;
  alice_basis: string;
  alice_bit: number;
  bob_basis: string;
  bob_outcome: string;
  expected_outcome: string;
  token_shots: number;
  token_errors: number;
  token_error_rate: number;
  status: string;
}

export interface QDSDetails {
  pool_size: number;
  declared_token_count: number;
  sifted_token_count: number;
  unsifted_token_count: number;
  sifted_indices: number[];
  unsifted_indices: number[];
  total_simulation_shots: number;
  unexpected_count: number;
  empirical_qber: number;
  wilson_ci_lower: number;
  wilson_ci_upper: number;
  confidence_interval_text: string;
  token_details: QDSTokenDetail[];
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
  decision_ledger?: DecisionLedger;
  qds_details?: QDSDetails;
  is_attack?: number;
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
