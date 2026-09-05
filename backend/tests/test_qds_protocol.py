import json
import pytest
from app.quantum.qds_protocol import (
    generate_alice_private_table,
    teleport_and_measure_enrollment,
    extract_signature_indices,
    create_signature_declaration,
    verify_sifted_declaration,
    DEFAULT_TOKEN_POOL_SIZE,
    DEFAULT_SIGNATURE_TOKEN_COUNT
)
from app.services.qds_service import QDSService
from app.services.verification_service import VerificationService
from app.services.threat_detection_service import ThreatDetectionService
from app.core.security import compute_sha256

def test_qds_protocol_components(db_session):
    """Verifies internal QDS protocol mathematical and algorithmic primitives."""
    # 1. Alice private table generation
    pool_size = 32
    alice_table = generate_alice_private_table(pool_size=pool_size)
    assert len(alice_table) == pool_size
    for entry in alice_table:
        assert entry["basis"] in ("Z", "X")
        assert entry["bit"] in (0, 1)
        assert entry["state_label"] in ("|0>", "|1>", "|+>", "|->")

    # 2. Teleportation & Bob immediate measurement
    bob_vk, telemetry = teleport_and_measure_enrollment(alice_table=alice_table, bell_state="Phi+")
    assert len(bob_vk) == pool_size
    assert len(telemetry) == pool_size
    for vk in bob_vk:
        assert vk["bob_basis"] in ("Z", "X")
        assert vk["bob_outcome"] in ("0", "1", "+", "-")

    # 3. Deterministic unbiased index selection
    digest_hex = compute_sha256("Test Message 123")
    token_count = 8
    indices = extract_signature_indices(digest_hex=digest_hex, pool_size=pool_size, token_count=token_count)
    assert len(indices) == token_count
    assert len(set(indices)) == token_count # All indices must be distinct
    for idx in indices:
        assert 0 <= idx < pool_size

    # Consistency: same digest and parameters must produce exact same indices
    indices_repeat = extract_signature_indices(digest_hex=digest_hex, pool_size=pool_size, token_count=token_count)
    assert indices == indices_repeat

    # 4. Classical declaration creation
    declaration = create_signature_declaration(alice_table, indices)
    assert len(declaration) == token_count
    dec_indices = [d["index"] for d in declaration]
    assert dec_indices == indices

    # 5. Basis Sifting & Outcome Verification (Legitimate, noiseless)
    res_legit = verify_sifted_declaration(
        bob_vk_table=bob_vk,
        declaration=declaration,
        shots_per_token=250,
        noise_rate=0.0,
        attack_scenario="NONE"
    )
    assert res_legit["pool_size"] == pool_size
    assert res_legit["declared_token_count"] == token_count
    # Expect roughly 50% sifting rate: between 1 and 7 sifted tokens
    assert 0 < res_legit["sifted_token_count"] <= token_count
    assert res_legit["empirical_qber"] == 0.0 # Perfectly zero error for legitimate channel
    assert res_legit["wilson_ci_upper"] <= 0.05 # Upper bound within threshold

    # 6. Forgery Attack Scenario
    res_forge = verify_sifted_declaration(
        bob_vk_table=bob_vk,
        declaration=declaration,
        shots_per_token=250,
        noise_rate=0.0,
        attack_scenario="SIGNATURE_FORGERY"
    )
    # Blind guessing produces approx 50% error on sifted positions
    if res_forge["sifted_token_count"] > 0:
        assert res_forge["empirical_qber"] > 0.20
        assert res_forge["wilson_ci_lower"] > 0.15 # Exceeds high threshold

    # 7. Intercept-Resend Attack Scenario
    res_ir = verify_sifted_declaration(
        bob_vk_table=bob_vk,
        declaration=declaration,
        shots_per_token=250,
        noise_rate=0.0,
        attack_scenario="INTERCEPT_RESEND"
    )
    if res_ir["sifted_token_count"] > 0:
        # Expected disturbance is approx 25%
        assert res_ir["empirical_qber"] > 0.05

def test_qds_end_to_end_signing_and_verification(db_session):
    """Verifies end-to-end QDS signing and verification workflow with Decision Ledger."""
    # 1. Alice creates QDS signature
    msg = "Authorise Bank Wire ₹100,000 to Account Y"
    sig_res = QDSService.create_signature(
        db=db_session,
        message=msg,
        signer_id="Signer-Alice",
        bell_state="Phi+",
        shots=1000
    )
    sig = sig_res["signature"]
    assert sig.signature_id is not None
    assert sig.qds_declaration is not None
    assert sig.qds_vk_record is not None
    assert sig.status == "GENERATED"

    # Verify Alice's unrevealed private table is NOT stored or leaked in signature
    assert not hasattr(sig, "alice_sk_table")

    # 2. Bob verifies legitimate signature
    verif_res = VerificationService.verify_signature(
        db=db_session,
        signature_id=sig.signature_id,
        verifier_id="Verifier-Bob",
        shots=1000,
        noise_rate=0.0
    )
    session = verif_res["session"]
    assert session.decision == "VERIFIED"
    assert session.threat_detected == "NONE"
    assert session.error_rate == 0.0
    assert session.is_attack == 0

    # Verify Decision Ledger structure
    ledger = verif_res["decision_ledger"]
    assert "rules" in ledger
    assert len(ledger["rules"]) == 6
    # All rules should pass for legitimate signature
    for r in ledger["rules"]:
        assert r["status"] == "PASS"

    # 3. Verify Replay Prevention: nonce should now be consumed
    db_session.refresh(sig)
    assert sig.nonce_consumed == 1

    # Attempt replay verification
    verif_replay = VerificationService.verify_signature(
        db=db_session,
        signature_id=sig.signature_id,
        verifier_id="Verifier-Bob",
        shots=1000
    )
    assert verif_replay["session"].decision == "REJECTED"
    assert verif_replay["session"].threat_detected == "REPLAY_ATTACK"
    replay_ledger = verif_replay["decision_ledger"]
    # Rule 3 should FAIL, subsequent rules NOT REACHED
    assert replay_ledger["rules"][0]["status"] == "PASS" # Rule 1
    assert replay_ledger["rules"][1]["status"] == "PASS" # Rule 2
    assert replay_ledger["rules"][2]["status"] == "FAIL" # Rule 3 (Replay)
    assert replay_ledger["rules"][3]["status"] == "NOT REACHED" # Rule 4
