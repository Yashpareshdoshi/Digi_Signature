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

def test_dashboard_summary_api():
    resp = client.get("/api/dashboard/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_signatures"] > 0
