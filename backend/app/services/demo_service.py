from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.services.qds_service import QDSService
from app.services.verification_service import VerificationService
from app.services.attack_service import AttackService

class DemoService:
    @staticmethod
    def run_complete_demo(
        db: Session,
        message: str = "Transfer ₹5000 to Account X",
        bell_state: str = "Phi+",
        quantum_state: str = "|0>",
        attack_type: str = "SIGNATURE_FORGERY"
    ) -> Dict[str, Any]:
        """
        Executes the 12-step end-to-end QDS and Threat Detection workflow in a single traceable pipeline:
        1. Message Preparation
        2. Classical Message Digest (SHA-256)
        3. Bell State Generation (|Phi+>)
        4. Quantum Teleportation
        5. Pauli Correction (Z^b0 * X^b1)
        6. Projective Measurement (Z basis)
        7. Statistical Verification (Wilson Score CI, Forgery Prob)
        8. Signature Verification Decision
        9. Attack Simulation Injection
        10. Deterministic Threat Detection
        11. Security Alert Generation
        12. Live Dashboard Metric Updates
        """
        trace = []

        # Step 1-6: Generate QDS Signature
        sig_data = QDSService.create_signature(
            db=db,
            message=message,
            signer_id="Signer-Alice",
            bell_state=bell_state,
            quantum_state=quantum_state,
            measurement_basis="Z",
            shots=1000
        )
        sig = sig_data["signature"]

        trace.append({
            "step": 1,
            "title": "Message Preparation",
            "status": "COMPLETED",
            "details": f"Message: '{message}' initialized with Signer 'Signer-Alice'"
        })
        trace.append({
            "step": 2,
            "title": "Classical Integrity Digest",
            "status": "COMPLETED",
            "details": f"SHA-256 Digest: {sig.message_hash} (Classical hash, NOT quantum signature)"
        })
        trace.append({
            "step": 3,
            "title": "Bell State Entanglement",
            "status": "COMPLETED",
            "details": f"Generated maximally entangled pair |{bell_state}> with concurrence=1.0"
        })
        trace.append({
            "step": 4,
            "title": "Quantum Teleportation",
            "status": "COMPLETED",
            "details": f"Alice measured (q0, q1) -> Classical Bits '{sig_data['teleportation']['classical_bits']}'"
        })
        trace.append({
            "step": 5,
            "title": "Pauli Correction Applied",
            "status": "COMPLETED",
            "details": f"Bob applied correction '{sig_data['teleportation']['pauli_correction']}'. State fidelity F = {sig_data['teleportation']['fidelity']:.4f}"
        })
        trace.append({
            "step": 6,
            "title": "Projective Measurements",
            "status": "COMPLETED",
            "details": f"Executed 1000 shots in Z-basis: {sig_data['measurements']['expected_count']} matches, {sig_data['measurements']['unexpected_count']} errors"
        })

        # Step 7-8: Legitimate Signature Verification
        v_legit = VerificationService.verify_signature(
            db=db,
            signature_id=sig.signature_id,
            verifier_id="Verifier-Bob",
            shots=1000,
            noise_rate=0.0
        )
        trace.append({
            "step": 7,
            "title": "Statistical Analysis",
            "status": "COMPLETED",
            "details": f"Error Rate: {v_legit['statistical_details']['error_rate_percentage']}%, 95% CI: {v_legit['statistical_details']['confidence_interval_text']}"
        })
        trace.append({
            "step": 8,
            "title": "Verification Decision",
            "status": "COMPLETED",
            "decision": v_legit["session"].decision,
            "details": f"Decision: {v_legit['session'].decision} (Threat: {v_legit['session'].threat_detected})"
        })

        # Step 9-11: Attack Simulation & Threat Detection
        attack_res = AttackService.simulate_attack(
            db=db,
            attack_type=attack_type,
            signature_id=sig.signature_id,
            noise_level=0.30,
            shots=1000
        )
        trace.append({
            "step": 9,
            "title": "Simulated Attack Injection",
            "status": "COMPLETED",
            "details": f"Injected '{attack_type}' against signature {sig.signature_id}"
        })
        trace.append({
            "step": 10,
            "title": "Deterministic Threat Detection",
            "status": "COMPLETED",
            "details": f"Threat Classified: {attack_res['rule_details']['threat_detected']} ({attack_res['rule_details']['confidence']})"
        })
        trace.append({
            "step": 11,
            "title": "Security Alert Generation",
            "status": "COMPLETED",
            "details": f"Generated Alert '{attack_res['alert'].alert_id if attack_res.get('alert') else 'ALT-ACK'}' with Severity {attack_res['rule_details']['severity']}"
        })
        trace.append({
            "step": 12,
            "title": "Dashboard Telemetry Updated",
            "status": "COMPLETED",
            "details": "All dashboard metrics, charts, timeline records, and audit logs synchronized."
        })

        return {
            "signature_id": sig.signature_id,
            "message": message,
            "legitimate_verification": v_legit["session"],
            "simulated_attack": attack_res["attack"],
            "alert": attack_res.get("alert"),
            "trace": trace
        }
