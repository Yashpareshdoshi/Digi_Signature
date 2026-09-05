import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.security import compute_sha256, generate_nonce, generate_signature_id
from app.models.signature import Signature
from app.models.measurement import Measurement
from app.models.setting import SystemSetting
from app.quantum.factory import get_quantum_backend
from app.quantum.measurement import get_expected_outcome
from app.quantum.qds_protocol import (
    generate_alice_private_table,
    teleport_and_measure_enrollment,
    extract_signature_indices,
    create_signature_declaration,
    DEFAULT_TOKEN_POOL_SIZE,
    DEFAULT_SIGNATURE_TOKEN_COUNT
)
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
        Executes Designated-Verifier, Memory-Free Sifted-Measurement QDS protocol:
        1. Generates fresh Nonce N and computes classical message integrity hash h = SHA-256(M || N).
        2. Alice generates private classical preparation table SK_A = {(B_A[i], alpha_A[i])} using BB84 states.
        3. Alice teleports each token to Bob via shared Bell pairs (CNOT, H, feed-forward bits, Pauli correction).
        4. Bob immediately measures each recovered state in random conjugate basis B_B[i] in {Z, X}.
        5. Bob stores ONLY the classical verification record VK_B = {(B_B[i], O_B[i])}. No quantum memory needed.
        6. Deterministic, unbiased index selection selects M tokens from pool L based on SHA-256(M || N).
        7. Alice reveals classical declaration Dec_A ONLY for the selected token indices.
        8. Persists signature with Dec_A and Bob's VK_B. Alice's unrevealed preparation table remains private.
        """
        backend = get_quantum_backend()

        # Dynamic pool and token count lookup from SQLite settings
        def _get_setting_int(k: str, default_val: int) -> int:
            try:
                row = db.query(SystemSetting).filter(SystemSetting.key == k).first()
                if row and row.value is not None:
                    return int(row.value)
            except Exception:
                pass
            return default_val

        pool_size = _get_setting_int("TOKEN_POOL_SIZE", DEFAULT_TOKEN_POOL_SIZE)
        token_count = _get_setting_int("SIGNATURE_TOKEN_COUNT", DEFAULT_SIGNATURE_TOKEN_COUNT)

        # Step 1: Classical Integrity Hash & Fresh Nonce
        nonce = generate_nonce(16)
        message_hash = compute_sha256(message + nonce)
        signature_id = generate_signature_id()

        # Step 2: Setup / Enrollment - Alice generates private preparation table SK_A
        alice_table = generate_alice_private_table(pool_size=pool_size)

        # Step 3 & 4: Teleportation & Bob immediate measurement -> VK_B
        bob_vk_table, teleport_telemetry = teleport_and_measure_enrollment(
            alice_table=alice_table,
            bell_state=bell_state,
            backend=backend
        )

        # Step 5: Deterministic, unbiased index selection from hash digest
        selected_indices = extract_signature_indices(
            digest_hex=message_hash,
            pool_size=pool_size,
            token_count=token_count
        )

        # Step 6: Alice classical declaration Dec_A for selected indices only
        declaration = create_signature_declaration(alice_table, selected_indices)

        # Extract representative primary token for legacy single-qubit views
        primary_token = declaration[0] if declaration else {"state_label": quantum_state, "basis": "Z"}
        primary_teleport = teleport_telemetry[selected_indices[0]] if selected_indices and selected_indices[0] < len(teleport_telemetry) else {
            "classical_bits": "00", "pauli_correction": "I", "fidelity": 1.0
        }

        # Step 7: Sample measurements for primary token (for legacy measurement inspection)
        primary_state = backend.get_pauli_state(primary_token["state_label"])
        exp_outcome = get_expected_outcome(primary_token["state_label"], primary_token["basis"])
        measurement_results = backend.measure(
            state=primary_state,
            basis=primary_token["basis"],
            shots=shots,
            expected_outcome=exp_outcome,
            noise_rate=0.0
        )

        # Step 8: Persist in SQLite DB with QDS fields
        sig_record = Signature(
            signature_id=signature_id,
            message=message,
            message_hash=message_hash,
            signer_id=signer_id,
            bell_state=bell_state,
            quantum_state=primary_token["state_label"],
            nonce=nonce,
            nonce_consumed=0,
            status="GENERATED",
            teleport_bits=primary_teleport.get("classical_bits", "00"),
            pauli_correction=primary_teleport.get("pauli_correction", "I"),
            teleport_fidelity=primary_teleport.get("fidelity", 1.0),
            qds_declaration=json.dumps(declaration),
            qds_vk_record=json.dumps(bob_vk_table),
            qds_token_indices=json.dumps(selected_indices),
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
                "token_pool_size": pool_size,
                "signature_tokens": token_count,
                "primary_state": primary_token["state_label"],
                "pauli_correction": primary_teleport.get("pauli_correction", "I"),
                "shots": shots
            }
        )

        return {
            "signature": sig_record,
            "teleportation": {
                "bell_state_used": bell_state,
                "classical_bits": primary_teleport.get("classical_bits", "00"),
                "pauli_correction": primary_teleport.get("pauli_correction", "I"),
                "fidelity": float(primary_teleport.get("fidelity", 1.0)),
                "steps": []
            },
            "measurements": measurement_results,
            "qds_declaration": declaration
        }
