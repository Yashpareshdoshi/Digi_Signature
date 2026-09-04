import time
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import compute_sha256, generate_session_id, generate_alert_id
from app.models.signature import Signature
from app.models.verification import VerificationSession
from app.models.alert import Alert
from app.quantum.factory import get_quantum_backend
from app.quantum.measurement import get_expected_outcome
from app.services.statistics_service import analyze_measurement_statistics
from app.services.threat_detection_service import ThreatDetectionService
from app.services.audit_service import AuditService

class VerificationService:
    @staticmethod
    def verify_signature(
        db: Session,
        signature_id: str,
        verifier_id: str = "Verifier-Bob",
        claimed_signer_id: Optional[str] = None,
        custom_message: Optional[str] = None,
        shots: int = 1000,
        noise_rate: float = 0.0,
        simulate_nonce_reuse: bool = False,
        forged_quantum_state: Optional[str] = None,
        intercept_resend: bool = False,
        low_threshold: Optional[float] = None,
        high_threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Executes complete deterministic signature verification:
        1. Checks signature existence and nonce consumption status.
        2. Evaluates claimed signer identity vs registered signer.
        3. Verifies classical SHA-256 message digest integrity.
        4. Simulates quantum projective measurement shots with optional noise.
        5. Computes exact empirical error rate, Wilson score 95% CI, and binomial forgery likelihood.
        6. Runs Threat Detection Engine (Rules 1-6).
        7. Persists VerificationSession, updates Signature status, creates Alert if threat detected.
        """
        start_time = time.time()
        
        low_t = low_threshold if low_threshold is not None else settings.LOW_ERROR_THRESHOLD
        high_t = high_threshold if high_threshold is not None else settings.HIGH_ERROR_THRESHOLD

        sig = db.query(Signature).filter(Signature.signature_id == signature_id).first()
        if not sig:
            raise ValueError(f"Signature '{signature_id}' not found.")

        # Check 1: Identity / Authorization Check
        claimed_signer = claimed_signer_id if claimed_signer_id else sig.signer_id
        identity_valid = (claimed_signer == sig.signer_id)

        # Check 2: Classical Message Digest Match
        msg_to_check = custom_message if custom_message is not None else sig.message
        calculated_hash = compute_sha256(msg_to_check)
        message_hash_match = (calculated_hash == sig.message_hash)

        # Check 3: Nonce Consumption / Replay
        nonce_already_consumed = (sig.nonce_consumed == 1) or simulate_nonce_reuse

        # Step 4: Quantum Measurement Simulation over the Teleported Quantum Channel via Backend
        backend = get_quantum_backend()

        if forged_quantum_state:
            # Attacker forged/injected a fabricated quantum state without the legitimate entangled key
            quantum_state = backend.get_pauli_state(forged_quantum_state)
        else:
            input_state = backend.get_pauli_state(sig.quantum_state)
            # Bob executes teleportation recovery using Alice's recorded classical bits
            teleport_res = backend.teleport(
                input_state=input_state,
                bell_state_name=sig.bell_state or "Phi+",
                force_measurement_bits=sig.teleport_bits
            )
            quantum_state = teleport_res.get("recovered_statevector") or backend.get_pauli_state(sig.quantum_state)

            # Intercept-Resend attack: Eve intercepts and measures flying qubit, causing state collapse
            if intercept_resend:
                quantum_state, _ = backend.apply_channel_noise(
                    state=quantum_state,
                    noise_type="intercept_resend",
                    noise_parameter=1.0
                )

            # Apply physical quantum channel noise (depolarizing / channel perturbation)
            if noise_rate > 0.0:
                quantum_state, _ = backend.apply_channel_noise(
                    state=quantum_state,
                    noise_type="depolarizing",
                    noise_parameter=noise_rate
                )

        # Default verification basis matches quantum state eigenbasis or Z
        basis = "Z" if sig.quantum_state in ("|0>", "|1>") else ("X" if sig.quantum_state in ("|+>", "|->") else "Y")
        expected_outcome = get_expected_outcome(sig.quantum_state, basis)

        meas_results = backend.measure(
            state=quantum_state,
            basis=basis,
            shots=shots,
            expected_outcome=expected_outcome,
            noise_rate=noise_rate
        )

        # Step 5: Statistical Analysis (Wilson Score CI & Binomial Forgery Likelihood)
        stats_analysis = analyze_measurement_statistics(
            unexpected_count=meas_results["unexpected_count"],
            total_shots=shots,
            low_threshold=low_t,
            high_threshold=high_t,
            confidence_level=settings.CONFIDENCE_LEVEL
        )

        # Step 6: Deterministic Threat Detection
        eval_result = ThreatDetectionService.evaluate_signature_security(
            identity_valid=identity_valid,
            nonce_already_consumed=nonce_already_consumed,
            message_hash_match=message_hash_match,
            error_rate=stats_analysis["error_rate"],
            low_threshold=low_t,
            high_threshold=high_t,
            confidence_upper=stats_analysis["confidence_upper"],
            forgery_probability=stats_analysis["forgery_probability"],
            signer_id=claimed_signer,
            verifier_id=verifier_id,
            nonce=sig.nonce
        )

        latency_ms = (time.time() - start_time) * 1000.0
        session_id = generate_session_id()

        # Step 7: Record Verification Session
        v_session = VerificationSession(
            session_id=session_id,
            signature_id=signature_id,
            verifier_id=verifier_id,
            signer_id=claimed_signer,
            measurement_count=shots,
            error_count=stats_analysis["unexpected_count"],
            error_rate=stats_analysis["error_rate"],
            forgery_probability=stats_analysis["forgery_probability"],
            confidence_lower=stats_analysis["confidence_lower"],
            confidence_upper=stats_analysis["confidence_upper"],
            decision=eval_result["decision"],
            threat_detected=eval_result["threat_detected"],
            reason=eval_result["reason"],
            latency_ms=latency_ms,
            created_at=datetime.utcnow()
        )
        db.add(v_session)

        # Update signature status and consume nonce if verified
        if eval_result["decision"] == "VERIFIED":
            sig.status = "VERIFIED"
            sig.nonce_consumed = 1
        elif eval_result["decision"] == "SUSPICIOUS":
            sig.status = "SUSPICIOUS"
        else:
            sig.status = "REJECTED"

        # Generate Alert if threat detected
        alert_record = None
        if eval_result["threat_detected"] != "NONE":
            alert_record = Alert(
                alert_id=generate_alert_id(),
                attack_id=None,
                signature_id=signature_id,
                severity=eval_result["severity"],
                title=eval_result["alert_title"],
                description=eval_result["reason"],
                threat_type=eval_result["threat_detected"],
                status="ACTIVE",
                created_at=datetime.utcnow()
            )
            db.add(alert_record)

        db.commit()
        db.refresh(v_session)

        # Audit Log
        AuditService.log_event(
            db=db,
            user_id=verifier_id,
            action="VERIFY_SIGNATURE",
            resource="signatures",
            resource_id=signature_id,
            details={
                "session_id": session_id,
                "decision": eval_result["decision"],
                "threat": eval_result["threat_detected"],
                "error_rate": stats_analysis["error_rate"],
                "latency_ms": round(latency_ms, 2)
            }
        )

        return {
            "session": v_session,
            "statistical_details": stats_analysis,
            "rule_details": eval_result,
            "measurement_counts": meas_results["counts"],
            "alert": alert_record
        }
