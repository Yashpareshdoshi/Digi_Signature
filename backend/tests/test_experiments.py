import pytest
from app.database.database import SessionLocal, Base, engine
from app.services.experiment_service import ExperimentService
from app.services.statistics_service import compute_false_positive_negative_rates

def test_compute_false_positive_negative_rates():
    trials = [
        {"is_attack": False, "decision": "VERIFIED"},
        {"is_attack": False, "decision": "VERIFIED"},
        {"is_attack": False, "decision": "REJECTED"}, # False positive
        {"is_attack": True, "decision": "REJECTED"},
        {"is_attack": True, "decision": "VERIFIED"},  # False negative
    ]
    rates = compute_false_positive_negative_rates(trials)
    assert abs(rates["false_positive_rate"] - (1.0 / 3.0)) < 1e-4
    assert rates["false_negative_rate"] == 0.5

def test_experiment_service_sweep_execution():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        exp = ExperimentService.run_sweep(
            db=db,
            name="Test Sweep",
            description="Unit test parameter sweep",
            states=["|0>"],
            bases=["Z"],
            shots_list=[200],
            noise_levels=[0.0, 0.20],
            trials_per_config=1,
            backend_name="numpy"
        )
        assert exp.experiment_id.startswith("EXP-")
        assert exp.total_trials == 2
        assert len(exp.trials) == 2
    finally:
        db.close()

def test_experiment_service_attack_sweep_qiskit():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        exp = ExperimentService.run_sweep(
            db=db,
            name="Qiskit Forgery Sweep",
            description="Unit test forgery sweep with qiskit backend",
            states=["|0>"],
            bases=["Z"],
            shots_list=[100],
            noise_levels=[0.0],
            trials_per_config=1,
            backend_name="qiskit",
            attack_scenario="SIGNATURE_FORGERY"
        )
        assert exp.experiment_id.startswith("EXP-")
        assert exp.total_trials == 1
        assert exp.trials[0].is_attack is True
        # Forged state |1> measured in Z basis expected |0> should have high error rate (1.0)
        assert exp.trials[0].error_rate > 0.8
        assert exp.trials[0].decision == "REJECTED"
    finally:
        db.close()

