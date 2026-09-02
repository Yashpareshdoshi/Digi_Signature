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
            # Forgery produces high quantum measurement error (e.g. ~48-52%)
            params["forgery_method"] = "Random Basis Guessing / State Manipulation"
            params["simulated_noise"] = 0.85
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                shots=shots,
                noise_rate=0.85 # High error rate
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "HIGH"
            reason = f"Simulated quantum signature forgery yielded {v_result['statistical_details']['error_rate_percentage']}% measurement error, exceeding rejection threshold."

        elif attack_type == "IMPERSONATION":
            params["forged_signer_identity"] = forged_signer
            v_result = VerificationService.verify_signature(
                db=db,
                signature_id=sig.signature_id,
                verifier_id="Verifier-Bob",
                claimed_signer_id=forged_signer,
                shots=shots
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
                shots=shots
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
                noise_rate=noise_level
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
                shots=shots
            )
            detected = 1 if v_result["session"].decision == "REJECTED" else 0
            severity = "HIGH"
            reason = "Unauthorized verifier identity and mismatched signer registry."

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
            "alert": v_result["alert"]
        }
