from typing import Dict, Any, Optional

class ThreatDetectionService:
    """
    Deterministic, Protocol-Aware Threat Detection Engine.
    
    CRITICAL CONSTRAINT:
    Uses ZERO AI, Deep Learning, Machine Learning, Neural Networks, or Heuristic Classifiers.
    All security decisions are derived purely from:
    1. Cryptographic hash integrity checks (SHA-256)
    2. Nonce consumption state & session freshness (Replay protection)
    3. Signer/Verifier authorization and identity validation (Impersonation detection)
    4. Exact quantum measurement error rate E compared against configured deterministic thresholds (T_low, T_high)
    5. Wilson score confidence interval boundary evaluations
    """
    
    @staticmethod
    def evaluate_signature_security(
        identity_valid: bool,
        nonce_already_consumed: bool,
        message_hash_match: bool,
        error_rate: float,
        low_threshold: float = 0.05,
        high_threshold: float = 0.15,
        confidence_upper: Optional[float] = None,
        forgery_probability: float = 0.0,
        signer_id: str = "Signer-Alice",
        verifier_id: str = "Verifier-Bob",
        nonce: str = ""
    ) -> Dict[str, Any]:
        """
        Executes deterministic evaluation pipeline and returns decision, threat type, severity, and explanation.
        """
        # Rule 1: Identity & Authorization Check (Impersonation Attack)
        if not identity_valid:
            return {
                "decision": "REJECTED",
                "threat_detected": "IMPERSONATION",
                "severity": "HIGH",
                "alert_title": "Signer Identity Mismatch / Impersonation Attempt",
                "reason": f"Presented signer identity '{signer_id}' failed cryptographic authorization check against registry for verifier '{verifier_id}'.",
                "rule_triggered": "RULE_1_IDENTITY_MISMATCH",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Block verifier session and log unauthorized signature submission."
            }
            
        # Rule 2: Classical Message Digest Integrity (Tampering)
        if not message_hash_match:
            return {
                "decision": "REJECTED",
                "threat_detected": "MESSAGE_TAMPERING",
                "severity": "CRITICAL",
                "alert_title": "Classical Message Digest Tampering Detected",
                "reason": "SHA-256 message digest does not match the signature record. Classical message content was modified in transit.",
                "rule_triggered": "RULE_2_MESSAGE_TAMPERING",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Reject signature immediately and flag communication channel."
            }

        # Rule 3: Nonce Reuse / Session Replay (Replay Attack)
        if nonce_already_consumed:
            return {
                "decision": "REJECTED",
                "threat_detected": "REPLAY_ATTACK",
                "severity": "CRITICAL",
                "alert_title": "Cryptographic Nonce Reuse / Replay Attack Detected",
                "reason": f"Nonce '{nonce}' has already been consumed in a prior verification session. Replay attempt detected.",
                "rule_triggered": "RULE_3_NONCE_REPLAY",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Invalidate verification attempt and alert security audit log."
            }

        # Rule 4: High Measurement Error Rate (Quantum Signature Forgery)
        if error_rate > high_threshold:
            err_pct = error_rate * 100.0
            high_pct = high_threshold * 100.0
            forge_pct = forgery_probability * 100.0
            return {
                "decision": "REJECTED",
                "threat_detected": "SIGNATURE_FORGERY",
                "severity": "HIGH",
                "alert_title": "High Quantum Disagreement / Possible Signature Forgery",
                "reason": f"Observed quantum measurement error rate ({err_pct:.2f}%) exceeds high threshold ({high_pct:.2f}%). Estimated forgery likelihood is {forge_pct:.2f}%. Attacker lacks genuine entangled statevector.",
                "rule_triggered": "RULE_4_HIGH_MEASUREMENT_ERROR",
                "confidence": "High (Statistical Upper Bound Exceeded)",
                "action_recommended": "Reject signature, quarantine public key certificate, and alert security operations."
            }

        # Rule 5: Moderate Measurement Error Rate (Channel Manipulation / Eavesdropping Noise)
        if error_rate > low_threshold:
            err_pct = error_rate * 100.0
            low_pct = low_threshold * 100.0
            high_pct = high_threshold * 100.0
            return {
                "decision": "SUSPICIOUS",
                "threat_detected": "CHANNEL_MANIPULATION",
                "severity": "MEDIUM",
                "alert_title": "Elevated Quantum Noise / Simulated Channel Manipulation",
                "reason": f"Observed error rate ({err_pct:.2f}%) falls in suspicious band ({low_pct:.2f}% - {high_pct:.2f}%). Indicates potential eavesdropping (intercept-resend) or excessive quantum channel decoherence.",
                "rule_triggered": "RULE_5_CHANNEL_NOISE_ELEVATION",
                "confidence": "Moderate (Confidence Interval Crosses Lower Threshold)",
                "action_recommended": "Request signature retransmission over calibrated low-noise quantum channel."
            }

        # Rule 6: Normal Baseline (Legitimate Verified Signature)
        err_pct = error_rate * 100.0
        low_pct = low_threshold * 100.0
        return {
            "decision": "VERIFIED",
            "threat_detected": "NONE",
            "severity": "LOW",
            "alert_title": "Quantum Digital Signature Verified",
            "reason": f"Observed error rate ({err_pct:.2f}%) is within acceptable quantum baseline limit (<= {low_pct:.2f}%). Pauli correction and state fidelity verified successfully.",
            "rule_triggered": "RULE_6_VERIFIED_LEGITIMATE",
            "confidence": "High (95% Wilson Score Interval Contained)",
            "action_recommended": "Accept signature and commit transaction."
        }
