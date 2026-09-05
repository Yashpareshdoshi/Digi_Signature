import json
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.security import generate_attack_id, generate_alert_id
from app.models.signature import Signature
from app.models.attack import Attack
from app.models.alert import Alert
from app.services.verification_service import VerificationService
from app.services.audit_service import AuditService

class AttackService:
    @staticmethod
    def simulate_attack(
        db: Session,
        attack_type: str,
        signature_id: Optional[str] = None,
        noise_level: float = 0.25,
        forged_signer: str = "Eve-Impersonator",
        shots: int = 1000
    ) -> Dict[str, Any]:
        """
        Safely simulates one of 5 standard cyber attacks against the QDS protocol:
        1. SIGNATURE_FORGERY: Attacker submits fabricated quantum state with random basis alignment (high error rate).
        2. IMPERSONATION: Unauthorized actor claims signer identity.
        3. REPLAY_ATTACK: Attacker captures and retransmits previously consumed nonce/signature.
        4. CHANNEL_MANIPULATION: Physical channel degradation or intercept-resend noise injection.
        5. UNAUTHORIZED_VERIFICATION: Unauthorized verifier privilege violation.
        """
        attack_type = attack_type.upper()
        attack_id = generate_attack_id()

        # Pick or validate target signature
        if signature_id:
            sig = db.query(Signature).filter(Signature.signature_id == signature_id).first()
        else:
            sig = db.query(Signature).order_by(Signature.id.desc()).first()

        if not sig:
            raise ValueError("No signatures available to attack. Please generate a signature first.")

        params = {
            "attack_type": attack_type,
            "target_signature_id": sig.signature_id,
            "target_message": sig.message,
            "shots": shots
        }

        # Configure verification simulation parameters per attack
        if attack_type == "SIGNATURE_FORGERY":
            # Forgery mechanism: Attacker does not know Alice's private basis/state.
            # Injects a conjugate/orthogonal state (e.g. |+> when Alice prepared |0>),
            # causing ~50% measurement error naturally from the quantum Born rule / Aer simulator.
            forged_state = "|+>" if sig.quantum_state in ("|0>", "|1>") else "|0>"
            params["forgery_method"] = f"Fabricated Quantum State Injection ({forged_state} instead of {sig.quantum_state})"
            params["forged_quantum_state"] = forged_state

            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                shots=shots,
                forged_quantum_state=forged_state,
                noise_rate=0.0, # Genuine quantum state mismatch produces the error naturally!
                is_attack=True
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "HIGH"
            reason = f"Quantum signature forgery detected: Fabricated state '{forged_state}' produced {v_result['statistical_details']['error_rate_percentage']}% measurement error in Alice's eigenbasis."

        elif attack_type in ("INTERCEPT_RESEND", "EAVESDROPPING"):
            params["attack_mechanism"] = "Eve intercept-resend measurement disturbance on flying qubit"
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                shots=shots,
                intercept_resend=True,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision in ("SUSPICIOUS", "REJECTED") else 0
            severity = "HIGH" if v_result["session"].decision == "REJECTED" else "MEDIUM"
            reason = f"Intercept-resend eavesdropping detected: Wave-function collapse produced {v_result['statistical_details']['error_rate_percentage']}% measurement disturbance."

        elif attack_type == "IMPERSONATION":
            params["forged_signer_identity"] = forged_signer
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                claimed_signer_id=forged_signer,
                shots=shots,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "HIGH"
            reason = f"Signer identity mismatch: Claimed '{forged_signer}' != registered '{sig.signer_id}'."

        elif attack_type == "REPLAY_ATTACK":
            params["replayed_nonce"] = sig.nonce
            # Force simulated nonce reuse
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                simulate_nonce_reuse=True,
                shots=shots,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "CRITICAL"
            reason = f"Replay attack detected: Nonce '{sig.nonce}' was previously consumed."

        elif attack_type == "CHANNEL_MANIPULATION":
            params["injected_channel_noise"] = noise_level
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                shots=shots,
                noise_rate=noise_level,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision in ("SUSPICIOUS", "REJECTED") else 0
            severity = "MEDIUM" if v_result["session"].decision == "SUSPICIOUS" else "HIGH"
            reason = f"Simulated quantum channel manipulation with noise={noise_level*100}% resulted in {v_result['statistical_details']['error_rate_percentage']}% measurement error."

        elif attack_type == "UNAUTHORIZED_VERIFICATION":
            params["unauthorized_verifier"] = "Unknown-External-Entity"
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Unknown-External-Entity",
                claimed_signer_id="Unauthorized-Signer",
                shots=shots,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "HIGH"
            reason = "Unauthorized verifier identity and mismatched signer registry."

        elif attack_type in ("MESSAGE_TAMPERING", "TAMPERING"):
            tampered_msg = f"{sig.message} [UNAUTHORIZED_MODIFICATION]"
            params["tampered_message"] = tampered_msg
            params["original_message"] = sig.message
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                custom_message=tampered_msg,
                shots=shots,
                is_attack=True
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "CRITICAL"
            reason = "Classical message tampering detected: Recalculated SHA-256 digest does not match signature record."

        else:
            raise ValueError(f"Unknown attack type: {attack_type}")

        # Record Attack in Database
        attack_record = Attack(
            attack_id=attack_id,
            signature_id=sig.signature_id,
            attack_type=attack_type,
            parameters=json.dumps(params),
            measurement_error=v_result["statistical_details"]["error_rate"],
            detected=detected,
            severity=severity,
            reason=reason,
            created_at=datetime.utcnow()
        )
        db.add(attack_record)
        
        # Link Alert to this Attack if created
        if v_result.get("alert"):
            v_result["alert"].attack_id = attack_id

        db.commit()
        db.refresh(attack_record)

        # Audit Log
        AuditService.log_event(
            db=db,
            user_id="Attacker-Sim",
            action="SIMULATE_ATTACK",
            resource="attacks",
            resource_id=attack_id,
            details=params
        )

        return {
            "attack": attack_record,
            "verification_session": v_result["session"],
            "statistical_details": v_result["statistical_details"],
            "rule_details": v_result["rule_details"],
            "decision_ledger": v_result.get("decision_ledger"),
            "qds_details": v_result.get("qds_details"),
            "alert": v_result["alert"]
        }
