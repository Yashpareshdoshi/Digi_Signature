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
