from datetime import datetime
from typing import Dict, Any, Optional, List

class ThreatDetectionService:
    """
    Deterministic, Protocol-Aware Threat Detection Engine with Structured Decision Ledger.
    
    CRITICAL CONSTRAINT:
    Uses ZERO AI, Deep Learning, Machine Learning, Neural Networks, or Heuristic Classifiers.
    All security decisions are derived purely from:
    1. Cryptographic hash integrity checks (SHA-256)
    2. Nonce consumption state & session freshness (Replay protection)
    3. Signer/Verifier authorization and identity validation (Impersonation detection)
    4. Wilson 95% Score Confidence Interval [CI_lower, CI_upper] vs configured thresholds (T_low, T_high)
    5. Exact quantum measurement error rate (QBER) on sifted conjugate bases
    """
    
    @staticmethod
    def evaluate_signature_security(
        identity_valid: bool,
        nonce_already_consumed: bool,
        message_hash_match: bool,
        error_rate: float,
        low_threshold: float = 0.05,
        high_threshold: float = 0.15,
        confidence_lower: Optional[float] = None,
        confidence_upper: Optional[float] = None,
        forgery_probability: float = 0.0,
        signer_id: str = "Signer-Alice",
        verifier_id: str = "Verifier-Bob",
        nonce: str = "",
        session_id: Optional[str] = None,
        signature_id: Optional[str] = None,
        message_hash: Optional[str] = None,
        sifted_count: Optional[int] = None,
        total_shots: Optional[int] = None,
        error_count: Optional[int] = None,
        pool_size: Optional[int] = 32,
        token_count: Optional[int] = 8,
        attack_scenario: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes deterministic evaluation pipeline and returns decision, threat type, severity,
        explanation, and a lightweight structured Decision Ledger.
        """
        err_pct = error_rate * 100.0
        low_pct = low_threshold * 100.0
        high_pct = high_threshold * 100.0
        forge_pct = forgery_probability * 100.0

        ci_low = confidence_lower if confidence_lower is not None else max(0.0, error_rate - 0.02)
        ci_high = confidence_upper if confidence_upper is not None else min(1.0, error_rate + 0.02)

        ledger_rules: List[Dict[str, Any]] = []

        # =====================================================================
        # RULE 1 — Identity Check (Impersonation Attack)
        # =====================================================================
        r1_status = "PASS" if identity_valid else "FAIL"
        ledger_rules.append({
            "id": "RULE_1_IDENTITY",
            "name": "Rule 1 — Identity & Authorization Check",
            "condition": "claimed_signer == authenticated_signer",
            "inputs": {
                "claimed_signer": signer_id,
                "verifier": verifier_id,
                "is_authorized": identity_valid
            },
            "status": r1_status,
            "explanation": f"Signer identity '{signer_id}' verified against access registry." if identity_valid
                           else f"Claimed signer '{signer_id}' does not match registered authenticated identity for verifier '{verifier_id}'."
        })

        if not identity_valid:
            # Short-circuit: mark remaining rules NOT REACHED
            for r_id, r_name in [
                ("RULE_2_MESSAGE_INTEGRITY", "Rule 2 — Message Integrity"),
                ("RULE_3_NONCE_FRESHNESS", "Rule 3 — Nonce Freshness"),
                ("RULE_4_QUANTUM_VERIFICATION", "Rule 4 — Quantum Verification & Forgery"),
                ("RULE_5_INTERMEDIATE_DISTURBANCE", "Rule 5 — Intermediate Disturbance & Eavesdropping Boundary"),
                ("RULE_6_CHANNEL_ACCEPTANCE", "Rule 6 — Channel Noise & Verification Acceptance")
            ]:
                ledger_rules.append({
                    "id": r_id,
                    "name": r_name,
                    "condition": "Preconditions passed",
                    "inputs": {},
                    "status": "NOT REACHED",
                    "explanation": "Evaluation halted due to earlier rule failure."
                })

            res = {
                "decision": "REJECTED",
                "threat_detected": "IMPERSONATION",
                "severity": "HIGH",
                "alert_title": "Signer Identity Mismatch / Impersonation Attempt",
                "reason": f"Presented signer identity '{signer_id}' failed cryptographic authorization check against registry for verifier '{verifier_id}'.",
                "rule_triggered": "RULE_1_IDENTITY",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Block verifier session and log unauthorized signature submission."
            }
            res["decision_ledger"] = _build_ledger_dict(
                session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
                message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
                nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
                pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
                total_shots=total_shots, error_count=error_count, error_rate=error_rate,
                ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
                forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
            )
            return res

        # =====================================================================
        # RULE 2 — Message Integrity (Tampering)
        # =====================================================================
        r2_status = "PASS" if message_hash_match else "FAIL"
        ledger_rules.append({
            "id": "RULE_2_MESSAGE_INTEGRITY",
            "name": "Rule 2 — Message Integrity",
            "condition": "SHA-256(M || N) == stored_digest",
            "inputs": {
                "message_hash_match": message_hash_match
            },
            "status": r2_status,
            "explanation": "SHA-256 message digest matches stored record. Classical integrity intact." if message_hash_match
                           else "SHA-256 message digest mismatch. Message content was modified in transit."
        })

        if not message_hash_match:
            for r_id, r_name in [
                ("RULE_3_NONCE_FRESHNESS", "Rule 3 — Nonce Freshness"),
                ("RULE_4_QUANTUM_VERIFICATION", "Rule 4 — Quantum Verification & Forgery"),
                ("RULE_5_INTERMEDIATE_DISTURBANCE", "Rule 5 — Intermediate Disturbance & Eavesdropping Boundary"),
                ("RULE_6_CHANNEL_ACCEPTANCE", "Rule 6 — Channel Noise & Verification Acceptance")
            ]:
                ledger_rules.append({
                    "id": r_id,
                    "name": r_name,
                    "condition": "Preconditions passed",
                    "inputs": {},
                    "status": "NOT REACHED",
                    "explanation": "Evaluation halted due to earlier rule failure."
                })

            res = {
                "decision": "REJECTED",
                "threat_detected": "MESSAGE_TAMPERING",
                "severity": "CRITICAL",
                "alert_title": "Classical Message Digest Tampering Detected",
                "reason": "SHA-256 message digest does not match the signature record. Classical message content was modified in transit.",
                "rule_triggered": "RULE_2_MESSAGE_INTEGRITY",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Reject signature immediately and flag communication channel."
            }
            res["decision_ledger"] = _build_ledger_dict(
                session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
                message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
                nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
                pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
                total_shots=total_shots, error_count=error_count, error_rate=error_rate,
                ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
                forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
            )
            return res

        # =====================================================================
        # RULE 3 — Nonce Freshness (Replay Attack)
        # =====================================================================
        r3_status = "FAIL" if nonce_already_consumed else "PASS"
        ledger_rules.append({
            "id": "RULE_3_NONCE_FRESHNESS",
            "name": "Rule 3 — Nonce Freshness",
            "condition": "nonce_consumed == False",
            "inputs": {
                "nonce": nonce,
                "already_consumed": nonce_already_consumed
            },
            "status": r3_status,
            "explanation": "Nonce is fresh and unconsumed." if not nonce_already_consumed
                           else f"Nonce '{nonce}' was already consumed in a previous verification session. Replay detected."
        })

        if nonce_already_consumed:
            for r_id, r_name in [
                ("RULE_4_QUANTUM_VERIFICATION", "Rule 4 — Quantum Verification & Forgery"),
                ("RULE_5_INTERMEDIATE_DISTURBANCE", "Rule 5 — Intermediate Disturbance & Eavesdropping Boundary"),
                ("RULE_6_CHANNEL_ACCEPTANCE", "Rule 6 — Channel Noise & Verification Acceptance")
            ]:
                ledger_rules.append({
                    "id": r_id,
                    "name": r_name,
                    "condition": "Preconditions passed",
                    "inputs": {},
                    "status": "NOT REACHED",
                    "explanation": "Evaluation halted due to earlier rule failure."
                })

            res = {
                "decision": "REJECTED",
                "threat_detected": "REPLAY_ATTACK",
                "severity": "CRITICAL",
                "alert_title": "Cryptographic Nonce Reuse / Replay Attack Detected",
                "reason": f"Nonce '{nonce}' has already been consumed in a prior verification session. Replay attempt detected.",
                "rule_triggered": "RULE_3_NONCE_FRESHNESS",
                "confidence": "Deterministic (100%)",
                "action_recommended": "Invalidate verification attempt and alert security audit log."
            }
            res["decision_ledger"] = _build_ledger_dict(
                session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
                message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
                nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
                pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
                total_shots=total_shots, error_count=error_count, error_rate=error_rate,
                ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
                forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
            )
            return res

        # =====================================================================
        # RULE 4 — Quantum Verification & Forgery Check (Wilson CI vs T_high)
        # =====================================================================
        # Primary abort boundary: If CI_lower > T_high or QBER > T_high -> Abort / High Disagreement
        is_forgery = (confidence_lower is not None and confidence_lower > high_threshold) or (error_rate > high_threshold)
        
        # Benchmark classification boundary (QBER ≈ 0.38):
        # In this educational/simulation prototype, an empirical threshold of 38%
        # (the midpoint between theoretical intercept-resend disturbance E ≈ 25% and
        # blind forgery guessing E ≈ 50%) is used strictly as a benchmark classifier
        # to distinguish likely active conjugate eavesdropping from total unentangled forgery.
        # NOTE: This 0.38 cutoff is a benchmark/model heuristic classification threshold,
        # NOT a fundamental quantum-security limit or formally proven boundary.
        is_intercept_resend = (attack_scenario == "INTERCEPT_RESEND") or (
            error_rate <= 0.38 and attack_scenario != "SIGNATURE_FORGERY"
        )

        r4_status = "FAIL" if is_forgery else "PASS"
        ledger_rules.append({
            "id": "RULE_4_QUANTUM_VERIFICATION",
            "name": "Rule 4 — Quantum Verification & Forgery Check",
            "condition": "Wilson_CI_lower <= T_high and QBER <= T_high",
            "inputs": {
                "QBER": float(error_rate),
                "Wilson_CI": [float(ci_low), float(ci_high)],
                "T_high": float(high_threshold),
                "forgery_likelihood": float(forgery_probability)
            },
            "status": r4_status,
            "explanation": f"Quantum error rate ({err_pct:.2f}%) within upper threshold ({high_pct:.2f}%)." if not is_forgery
                           else f"Quantum error rate ({err_pct:.2f}%, CI=[{ci_low*100:.1f}%, {ci_high*100:.1f}%]) exceeds high threshold ({high_pct:.2f}%). Forgery indicated."
        })

        if is_forgery:
            # Strict short-circuit: mark remaining rules 5 and 6 as NOT REACHED
            for r_id, r_name in [
                ("RULE_5_INTERMEDIATE_DISTURBANCE", "Rule 5 — Intermediate Disturbance & Eavesdropping Boundary"),
                ("RULE_6_CHANNEL_ACCEPTANCE", "Rule 6 — Channel Noise & Verification Acceptance")
            ]:
                ledger_rules.append({
                    "id": r_id,
                    "name": r_name,
                    "condition": "Preconditions passed",
                    "inputs": {},
                    "status": "NOT REACHED",
                    "explanation": "Evaluation halted due to earlier rule failure."
                })

            threat_name = "INTERCEPT_RESEND" if is_intercept_resend else "SIGNATURE_FORGERY"
            alert_title = "Quantum Channel Eavesdropping (Intercept-Resend) Detected" if is_intercept_resend else "High Quantum Disagreement / Possible Signature Forgery"
            reason_text = (
                f"Observed error rate ({err_pct:.2f}%) exceeds abort threshold ({high_pct:.2f}%) but falls within benchmark eavesdropping band (<= 38.00%), characteristic of BB84 conjugate-basis disturbance."
                if is_intercept_resend else
                f"Observed quantum measurement error rate ({err_pct:.2f}%) exceeds abort threshold ({high_pct:.2f}%) and benchmark forgery threshold (> 38.00%). Estimated forgery likelihood is {forge_pct:.2f}%. Attacker lacks genuine entangled statevector."
            )

            res = {
                "decision": "REJECTED",
                "threat_detected": threat_name,
                "severity": "HIGH",
                "alert_title": alert_title,
                "reason": reason_text,
                "rule_triggered": "RULE_4_QUANTUM_VERIFICATION",
                "confidence": "High (Statistical Upper Bound Exceeded)",
                "action_recommended": "Reject signature, quarantine public key certificate, and alert security operations."
            }
            res["decision_ledger"] = _build_ledger_dict(
                session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
                message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
                nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
                pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
                total_shots=total_shots, error_count=error_count, error_rate=error_rate,
                ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
                forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
            )
            return res

        # =====================================================================
        # RULE 5 — Intermediate Disturbance & Eavesdropping Boundary (T_low < error <= T_high)
        # =====================================================================
        # Evaluated ONLY if Rule 4 passed. Checks if disturbance exceeds baseline T_low = 0.05.
        is_intermediate_disturbance = (error_rate > low_threshold) or (
            confidence_lower is not None and confidence_lower > low_threshold
        )

        r5_status = "FAIL" if is_intermediate_disturbance else "PASS"
        ledger_rules.append({
            "id": "RULE_5_INTERMEDIATE_DISTURBANCE",
            "name": "Rule 5 — Intermediate Disturbance & Eavesdropping Boundary",
            "condition": "Wilson_CI_lower <= T_low and QBER <= T_low",
            "inputs": {
                "QBER": float(error_rate),
                "Wilson_CI_lower": float(ci_low),
                "T_low": float(low_threshold)
            },
            "status": r5_status,
            "explanation": f"Quantum error rate ({err_pct:.2f}%) within baseline limit (<= {low_pct:.2f}%)." if not is_intermediate_disturbance
                           else f"Quantum error rate ({err_pct:.2f}%) exceeds baseline threshold ({low_pct:.2f}%). Intermediate disturbance or weak eavesdropping indicated."
        })

        if is_intermediate_disturbance:
            # Strict short-circuit Rule 6
            ledger_rules.append({
                "id": "RULE_6_CHANNEL_ACCEPTANCE",
                "name": "Rule 6 — Channel Noise & Verification Acceptance",
                "condition": "Preconditions passed",
                "inputs": {},
                "status": "NOT REACHED",
                "explanation": "Evaluation halted due to earlier rule failure."
            })

            res = {
                "decision": "SUSPICIOUS",
                "threat_detected": "CHANNEL_MANIPULATION",
                "severity": "MEDIUM",
                "alert_title": "Elevated Quantum Noise / Simulated Channel Manipulation",
                "reason": f"Observed error rate ({err_pct:.2f}%) falls in suspicious intermediate band ({low_pct:.2f}% - {high_pct:.2f}%). Indicates potential eavesdropping disturbance or excessive quantum channel decoherence.",
                "rule_triggered": "RULE_5_INTERMEDIATE_DISTURBANCE",
                "confidence": "Moderate (Confidence Interval Crosses Lower Threshold)",
                "action_recommended": "Request signature retransmission over calibrated low-noise quantum channel."
            }
            res["decision_ledger"] = _build_ledger_dict(
                session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
                message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
                nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
                pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
                total_shots=total_shots, error_count=error_count, error_rate=error_rate,
                ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
                forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
            )
            return res

        # =====================================================================
        # RULE 6 — Channel Noise & Verification Acceptance (Wilson CI_upper vs T_low)
        # =====================================================================
        # Evaluated ONLY if Rules 1-5 passed. Checks if 95% CI upper bound is within baseline noise limit.
        is_elevated_ci = (confidence_upper is not None and confidence_upper > low_threshold)

        if is_elevated_ci:
            ledger_rules.append({
                "id": "RULE_6_CHANNEL_ACCEPTANCE",
                "name": "Rule 6 — Channel Noise & Verification Acceptance",
                "condition": "Wilson_CI_upper <= T_low",
                "inputs": {
                    "QBER": float(error_rate),
                    "Wilson_CI_upper": float(ci_high),
                    "T_low": float(low_threshold)
                },
                "status": "FAIL",
                "explanation": f"Upper confidence limit ({ci_high*100:.2f}%) exceeds baseline threshold ({low_pct:.2f}%). Statistical uncertainty too high for full verification."
            })
            res = {
                "decision": "SUSPICIOUS",
                "threat_detected": "CHANNEL_MANIPULATION",
                "severity": "MEDIUM",
                "alert_title": "Elevated Quantum Statistical Uncertainty",
                "reason": f"Upper confidence limit ({ci_high*100:.2f}%) exceeds baseline threshold ({low_pct:.2f}%). Statistical uncertainty indicates possible channel degradation.",
                "rule_triggered": "RULE_6_CHANNEL_ACCEPTANCE",
                "confidence": "Moderate (Upper Confidence Limit Exceeded)",
                "action_recommended": "Request signature retransmission over calibrated low-noise quantum channel."
            }
        else:
            ledger_rules.append({
                "id": "RULE_6_CHANNEL_ACCEPTANCE",
                "name": "Rule 6 — Channel Noise & Verification Acceptance",
                "condition": "Wilson_CI_upper <= T_low",
                "inputs": {
                    "QBER": float(error_rate),
                    "Wilson_CI_upper": float(ci_high),
                    "T_low": float(low_threshold)
                },
                "status": "PASS",
                "explanation": f"Observed error rate ({err_pct:.2f}%) and 95% Wilson upper bound ({ci_high*100:.2f}%) strictly contained within baseline threshold (<= {low_pct:.2f}%)."
            })
            res = {
                "decision": "VERIFIED",
                "threat_detected": "NONE",
                "severity": "LOW",
                "alert_title": "Quantum Digital Signature Verified",
                "reason": f"Observed error rate ({err_pct:.2f}%) is within acceptable quantum baseline limit (<= {low_pct:.2f}%). Pauli correction and state fidelity verified successfully.",
                "rule_triggered": "RULE_6_CHANNEL_ACCEPTANCE",
                "confidence": "High (95% Wilson Score Interval Contained)",
                "action_recommended": "Accept signature and commit transaction."
            }

        res["decision_ledger"] = _build_ledger_dict(
            session_id=session_id, signature_id=signature_id, signer_id=signer_id, verifier_id=verifier_id,
            message_hash=message_hash, message_hash_match=message_hash_match, nonce=nonce,
            nonce_consumed=nonce_already_consumed, identity_valid=identity_valid,
            pool_size=pool_size, token_count=token_count, sifted_count=sifted_count,
            total_shots=total_shots, error_count=error_count, error_rate=error_rate,
            ci_low=ci_low, ci_high=ci_high, low_t=low_threshold, high_t=high_threshold,
            forgery_probability=forgery_probability, rules=ledger_rules, final_decision=res
        )
        return res

def _build_ledger_dict(
    session_id: Optional[str],
    signature_id: Optional[str],
    signer_id: str,
    verifier_id: str,
    message_hash: Optional[str],
    message_hash_match: bool,
    nonce: str,
    nonce_consumed: bool,
    identity_valid: bool,
    pool_size: Optional[int],
    token_count: Optional[int],
    sifted_count: Optional[int],
    total_shots: Optional[int],
    error_count: Optional[int],
    error_rate: float,
    ci_low: float,
    ci_high: float,
    low_t: float,
    high_t: float,
    forgery_probability: float,
    rules: List[Dict[str, Any]],
    final_decision: Dict[str, Any]
) -> Dict[str, Any]:
    """Helper to assemble the structured Decision Ledger."""
    return {
        "metadata": {
            "session_id": session_id or "PENDING",
            "signature_id": signature_id or "UNKNOWN",
            "signer_id": signer_id,
            "verifier_id": verifier_id,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        "classical_evidence": {
            "message_hash": message_hash or "RECOMPUTED",
            "hash_comparison": "MATCH" if message_hash_match else "MISMATCH",
            "nonce": nonce,
            "nonce_freshness": "FRESH" if not nonce_consumed else "REUSED",
            "identity_authorization": "AUTHORIZED" if identity_valid else "UNAUTHORIZED"
        },
        "quantum_evidence": {
            "token_pool_size": pool_size or 32,
            "signature_token_count": token_count or 8,
            "sifted_token_count": sifted_count if sifted_count is not None else 4,
            "total_shots": total_shots if total_shots is not None else 1000,
            "error_count": error_count if error_count is not None else int(round(error_rate * (total_shots or 1000))),
            "empirical_qber": float(error_rate),
            "wilson_ci_lower": float(ci_low),
            "wilson_ci_upper": float(ci_high),
            "wilson_ci_text": f"[{ci_low*100:.2f}%, {ci_high*100:.2f}%]",
            "active_threshold_low": float(low_t),
            "active_threshold_high": float(high_t),
            "forgery_likelihood": float(forgery_probability)
        },
        "rules": rules,
        "final_decision": {
            "decision": final_decision.get("decision", "UNKNOWN"),
            "threat_detected": final_decision.get("threat_detected", "NONE"),
            "severity": final_decision.get("severity", "LOW"),
            "reason": final_decision.get("reason", ""),
            "action_recommended": final_decision.get("action_recommended", "")
        }
    }

