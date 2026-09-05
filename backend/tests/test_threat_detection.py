import pytest
from app.services.threat_detection_service import ThreatDetectionService

def test_impersonation_detection():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=False,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.01,
        signer_id="Eve",
        verifier_id="Bob"
    )
    assert eval_res["decision"] == "REJECTED"
    assert eval_res["threat_detected"] == "IMPERSONATION"
    assert eval_res["severity"] == "HIGH"

def test_replay_detection():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=True,
        message_hash_match=True,
        error_rate=0.01,
        nonce="NONCE-12345"
    )
    assert eval_res["decision"] == "REJECTED"
    assert eval_res["threat_detected"] == "REPLAY_ATTACK"
    assert eval_res["severity"] == "CRITICAL"

def test_forgery_high_error():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.48,
        low_threshold=0.05,
        high_threshold=0.15,
        forgery_probability=0.99
    )
    assert eval_res["decision"] == "REJECTED"
    assert eval_res["threat_detected"] == "SIGNATURE_FORGERY"

def test_channel_noise_suspicious():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.10,
        low_threshold=0.05,
        high_threshold=0.15
    )
    assert eval_res["decision"] == "SUSPICIOUS"
    assert eval_res["threat_detected"] == "CHANNEL_MANIPULATION"

def test_legitimate_verified():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.015,
        low_threshold=0.05,
        high_threshold=0.15
    )
    assert eval_res["decision"] == "VERIFIED"
    assert eval_res["threat_detected"] == "NONE"

def test_message_tampering_detection():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=False, # Digest mismatch
        error_rate=0.01
    )
    assert eval_res["decision"] == "REJECTED"
    assert eval_res["threat_detected"] == "MESSAGE_TAMPERING"
    assert eval_res["severity"] == "CRITICAL"

def test_intercept_resend_threat_detection():
    eval_res = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.25,
        confidence_lower=0.21,
        confidence_upper=0.29,
        low_threshold=0.05,
        high_threshold=0.15,
        attack_scenario="INTERCEPT_RESEND"
    )
    assert eval_res["decision"] == "REJECTED"
    assert eval_res["threat_detected"] == "INTERCEPT_RESEND"

def test_decision_ledger_structure():
    # Test valid case: all rules evaluated
    res_valid = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.01,
        confidence_lower=0.0,
        confidence_upper=0.02,
        low_threshold=0.05,
        high_threshold=0.15
    )
    ledger = res_valid["decision_ledger"]
    assert "metadata" in ledger
    assert "classical_evidence" in ledger
    assert "quantum_evidence" in ledger
    assert "rules" in ledger
    assert len(ledger["rules"]) == 6
    assert all(r["status"] == "PASS" for r in ledger["rules"])

    # Test short-circuit on Rule 1: identity invalid
    res_short = ThreatDetectionService.evaluate_signature_security(
        identity_valid=False,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.01
    )
    rules_short = res_short["decision_ledger"]["rules"]
    assert rules_short[0]["status"] == "FAIL"
    assert all(r["status"] == "NOT REACHED" for r in rules_short[1:])
    assert res_short["rule_triggered"] == "RULE_1_IDENTITY"

def test_decision_ledger_rule4_short_circuit():
    """Verify Rule 4 failure causes Rules 5 and 6 to be NOT REACHED and rule_triggered matches."""
    # Intercept-resend: error_rate = 0.25 > T_high (0.15)
    res_ir = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.25,
        confidence_lower=0.21,
        confidence_upper=0.29,
        low_threshold=0.05,
        high_threshold=0.15,
        attack_scenario="INTERCEPT_RESEND"
    )
    rules = res_ir["decision_ledger"]["rules"]
    assert rules[0]["status"] == "PASS" # Rule 1
    assert rules[1]["status"] == "PASS" # Rule 2
    assert rules[2]["status"] == "PASS" # Rule 3
    assert rules[3]["status"] == "FAIL" # Rule 4 (Breaches abort boundary 0.15)
    assert rules[4]["status"] == "NOT REACHED" # Rule 5 strictly NOT REACHED
    assert rules[5]["status"] == "NOT REACHED" # Rule 6 strictly NOT REACHED
    assert res_ir["rule_triggered"] == "RULE_4_QUANTUM_VERIFICATION"
    assert res_ir["threat_detected"] == "INTERCEPT_RESEND"

    # Blind forgery: error_rate = 0.48 > 0.38
    res_forge = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.48,
        confidence_lower=0.44,
        confidence_upper=0.52,
        low_threshold=0.05,
        high_threshold=0.15
    )
    rules_f = res_forge["decision_ledger"]["rules"]
    assert rules_f[3]["status"] == "FAIL" # Rule 4
    assert rules_f[4]["status"] == "NOT REACHED" # Rule 5
    assert rules_f[5]["status"] == "NOT REACHED" # Rule 6
    assert res_forge["rule_triggered"] == "RULE_4_QUANTUM_VERIFICATION"
    assert res_forge["threat_detected"] == "SIGNATURE_FORGERY"

def test_decision_ledger_rule5_intermediate_disturbance():
    """Verify Rule 5 detects intermediate disturbance (0.05 < E <= 0.15) and Rule 6 is NOT REACHED."""
    res_int = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True,
        nonce_already_consumed=False,
        message_hash_match=True,
        error_rate=0.10,
        confidence_lower=0.07,
        confidence_upper=0.13,
        low_threshold=0.05,
        high_threshold=0.15
    )
    rules = res_int["decision_ledger"]["rules"]
    assert rules[0]["status"] == "PASS" # Rule 1
    assert rules[1]["status"] == "PASS" # Rule 2
    assert rules[2]["status"] == "PASS" # Rule 3
    assert rules[3]["status"] == "PASS" # Rule 4 (0.10 <= 0.15)
    assert rules[4]["status"] == "FAIL" # Rule 5 (0.10 > 0.05)
    assert rules[5]["status"] == "NOT REACHED" # Rule 6 strictly NOT REACHED
    assert res_int["rule_triggered"] == "RULE_5_INTERMEDIATE_DISTURBANCE"
    assert res_int["decision"] == "SUSPICIOUS"

def test_decision_ledger_exact_rule_matching():
    """Verify rule_triggered exactly matches the first failed rule across all failure modes."""
    # Rule 2: Message Tampering
    res2 = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True, nonce_already_consumed=False, message_hash_match=False, error_rate=0.01
    )
    assert res2["rule_triggered"] == "RULE_2_MESSAGE_INTEGRITY"
    assert res2["decision_ledger"]["rules"][1]["status"] == "FAIL"
    assert res2["decision_ledger"]["rules"][2]["status"] == "NOT REACHED"

    # Rule 3: Nonce Replay
    res3 = ThreatDetectionService.evaluate_signature_security(
        identity_valid=True, nonce_already_consumed=True, message_hash_match=True, error_rate=0.01
    )
    assert res3["rule_triggered"] == "RULE_3_NONCE_FRESHNESS"
    assert res3["decision_ledger"]["rules"][2]["status"] == "FAIL"
    assert res3["decision_ledger"]["rules"][3]["status"] == "NOT REACHED"


