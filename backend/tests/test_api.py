import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

def test_create_and_verify_signature_api():
    # 1. Create signature
    payload = {
        "message": "Transfer ₹5000 to Account X",
        "signer_id": "Signer-Alice",
        "bell_state": "Phi+",
        "quantum_state": "|0>",
        "measurement_basis": "Z",
        "shots": 1000
    }
    resp = client.post("/api/signatures", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "signature_id" in data
    sig_id = data["signature_id"]

    # 2. Verify signature
    v_payload = {
        "signature_id": sig_id,
        "verifier_id": "Verifier-Bob",
        "shots": 1000
    }
    v_resp = client.post("/api/verification/start", json=v_payload)
    assert v_resp.status_code == 200
    v_data = v_resp.json()
    assert v_data["decision"] == "VERIFIED"
    assert v_data["threat_detected"] == "NONE"

def test_attack_simulation_api():
    # Simulate forgery attack
    payload = {
        "attack_type": "SIGNATURE_FORGERY",
        "shots": 1000
    }
    resp = client.post("/api/attacks/simulate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["attack_type"] == "SIGNATURE_FORGERY"
    assert data["detected"] == 1

def test_message_tampering_attack_api():
    payload = {
        "attack_type": "MESSAGE_TAMPERING",
        "shots": 1000
    }
    resp = client.post("/api/attacks/simulate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["attack_type"] == "MESSAGE_TAMPERING"
    assert data["detected"] == 1
    assert data["severity"] == "CRITICAL"

def test_dashboard_summary_api():
    resp = client.get("/api/dashboard/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_signatures"] > 0

def test_api_key_authentication():
    # 1. Test invalid API key -> 401
    bad_resp = client.post(
        "/api/signatures",
        json={"message": "Unauthorized payload"},
        headers={"X-API-Key": "INVALID-KEY-XYZ"}
    )
    assert bad_resp.status_code == 401

    # 2. Test valid Signer key -> 200
    good_resp = client.post(
        "/api/signatures",
        json={"message": "Authorized payload"},
        headers={"X-API-Key": "SIG-KEY-ALICE-101"}
    )
    assert good_resp.status_code == 200

    # 3. Test wrong role (Verifier trying to create signature) -> 403
    wrong_role_resp = client.post(
        "/api/signatures",
        json={"message": "Forbidden payload"},
        headers={"X-API-Key": "VER-KEY-BOB-202"}
    )
    assert wrong_role_resp.status_code == 403
