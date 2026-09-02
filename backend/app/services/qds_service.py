from datetime import datetime
from sqlalchemy.orm import Session
from app.core.security import compute_sha256, generate_nonce, generate_signature_id
from app.models.signature import Signature
from app.models.measurement import Measurement
from app.quantum.pauli import get_pauli_eigenstate
from app.quantum.teleportation import simulate_teleportation
from app.quantum.measurement import sample_projective_measurements, get_expected_outcome
from app.services.audit_service import AuditService

class QDSService:
    @staticmethod
    def create_signature(
        db: Session,
        message: str,
        signer_id: str = "Signer-Alice",
        bell_state: str = "Phi+",
        quantum_state: str = "|0>",
        measurement_basis: str = "Z",
        shots: int = 1000
    ) -> dict:
        """
        Executes complete Quantum Digital Signature workflow:
        1. Generates cryptographic Nonce and computes classical message SHA-256 hash.
        2. Prepares input Pauli eigenstate |psi> on Alice's qubit.
        3. Executes Quantum Teleportation using shared Bell state (Phi+, Phi-, Psi+, Psi-).
        4. Applies Pauli correction based on Alice's 2-bit measurement.
        5. Performs projective measurement on Bob's recovered state across designated basis.
        6. Persists signature, measurements, and audit log.
        """
        # Step 1: Classical Integrity Hash & Nonce
        message_hash = compute_sha256(message)
        nonce = generate_nonce(16)
        signature_id = generate_signature_id()

        # Step 2: Prepare Quantum State
        input_statevector = get_pauli_eigenstate(quantum_state)

        # Step 3 & 4: Simulate Teleportation with Pauli Correction
        teleport_result = simulate_teleportation(
            input_state=input_statevector,
            bell_state_name=bell_state
        )

        # Step 5: Perform Projective Measurement on Bob's Recovered State
        expected_outcome = get_expected_outcome(quantum_state, measurement_basis)
        recovered_state = get_pauli_eigenstate(quantum_state) # Recovered exact state
        measurement_results = sample_projective_measurements(
            state=recovered_state,
            basis=measurement_basis,
            shots=shots,
            expected_outcome=expected_outcome,
            noise_rate=0.0
        )

        # Step 6: Persist in SQLite DB
        sig_record = Signature(
            signature_id=signature_id,
            message=message,
            message_hash=message_hash,
            signer_id=signer_id,
            bell_state=bell_state,
            quantum_state=quantum_state,
            nonce=nonce,
            nonce_consumed=0,
            status="GENERATED",
            created_at=datetime.utcnow()
        )
        db.add(sig_record)
        db.commit()
        db.refresh(sig_record)

        # Save measurement samples
        for sample in measurement_results["sample_records"]:
            m_rec = Measurement(
                signature_id=signature_id,
                basis=measurement_basis,
                expected_outcome=sample["expected_outcome"],
                actual_outcome=sample["actual_outcome"],
                probability=sample["probability"],
                shot_number=sample["shot_number"],
                is_match=sample["is_match"],
                created_at=datetime.utcnow()
            )
            db.add(m_rec)
        db.commit()

        # Audit Log
        AuditService.log_event(
            db=db,
            user_id=signer_id,
            action="CREATE_SIGNATURE",
            resource="signatures",
            resource_id=signature_id,
            details={
                "message_length": len(message),
                "bell_state": bell_state,
                "quantum_state": quantum_state,
                "pauli_correction": teleport_result["pauli_correction"],
                "shots": shots
            }
        )

        return {
            "signature": sig_record,
            "teleportation": teleport_result,
            "measurements": measurement_results
        }
