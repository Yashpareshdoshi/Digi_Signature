import pytest
import numpy as np
from app.quantum.factory import get_quantum_backend
from app.quantum.numpy_backend import NumpyBackend
from app.quantum.qiskit_backend import QiskitBackend

def test_numpy_backend_contract():
    backend = NumpyBackend()
    assert backend.name == "numpy"

    # Test Pauli state
    s0 = backend.get_pauli_state("|0>")
    s1 = backend.get_pauli_state("|1>")
    assert np.isclose(backend.calculate_fidelity(s0, s0), 1.0)
    assert np.isclose(backend.calculate_fidelity(s0, s1), 0.0)

    # Test Bell state creation
    bell = backend.create_bell_state("Phi+")
    assert bell.num_qubits == 2
    probs = bell.probabilities()
    assert np.isclose(probs[0], 0.5)
    assert np.isclose(probs[3], 0.5)

    # Test Teleportation
    tele_res = backend.teleport(input_state=s0, bell_state_name="Phi+", force_measurement_bits="00")
    assert np.isclose(tele_res["fidelity"], 1.0)
    assert tele_res["classical_bits"] == "00"
    assert tele_res["pauli_correction"] == "I"

    # Test Measure
    meas = backend.measure(state=s0, basis="Z", shots=500)
    assert meas["counts"]["0"] == 500
    assert meas["empirical_error_rate"] == 0.0

def test_factory_fallback_and_resolution():
    backend_default = get_quantum_backend()
    assert backend_default is not None
    assert backend_default.name in ("numpy", "qiskit")

    backend_numpy = get_quantum_backend("numpy")
    assert backend_numpy.name == "numpy"

    backend_qiskit = get_quantum_backend("qiskit")
    assert backend_qiskit.name == "qiskit"

def test_qiskit_bell_state_cross_validation():
    np_backend = NumpyBackend()
    qk_backend = QiskitBackend()

    # Compare Bell state probabilities between NumPy and Qiskit
    for b_name in ["Phi+", "Phi-", "Psi+", "Psi-"]:
        b_np = np_backend.create_bell_state(b_name)
        b_qk = qk_backend.create_bell_state(b_name)
        assert np.allclose(b_np.probabilities(), b_qk.probabilities(), atol=1e-5), f"Bell mismatch on {b_name}"

def test_qiskit_teleportation_cross_validation():
    np_backend = NumpyBackend()
    qk_backend = QiskitBackend()

    # Compare Teleportation fidelity across all 6 Pauli eigenstates x 4 branches
    for state_lbl in ["|0>", "|1>", "|+>", "|->", "|+i>", "|-i>"]:
        s_np = np_backend.get_pauli_state(state_lbl)
        s_qk = qk_backend.get_pauli_state(state_lbl)

        for branch in ["00", "01", "10", "11"]:
            res_np = np_backend.teleport(s_np, "Phi+", force_measurement_bits=branch)
            res_qk = qk_backend.teleport(s_qk, "Phi+", force_measurement_bits=branch)

            assert np.isclose(res_np["fidelity"], 1.0, atol=1e-5)
            assert np.isclose(res_qk["fidelity"], 1.0, atol=1e-5)
            assert res_np["classical_bits"] == res_qk["classical_bits"]
            assert res_np["pauli_correction"] == res_qk["pauli_correction"]

def test_qiskit_aer_measurement_and_noise():
    qk_backend = QiskitBackend()
    s_plus = qk_backend.get_pauli_state("|+>")

    # In X basis, |+> must measure '+' with ~0 error
    ideal_meas = qk_backend.measure(s_plus, basis="X", shots=1000, expected_outcome="+", noise_rate=0.0)
    assert ideal_meas["counts"]["+"] == 1000
    assert ideal_meas["empirical_error_rate"] == 0.0

    # With 20% depolarizing noise, AerSimulator must yield ~10% error
    noisy_meas = qk_backend.measure(s_plus, basis="X", shots=2000, expected_outcome="+", noise_rate=0.20)
    err = noisy_meas["empirical_error_rate"]
    assert 0.05 <= err <= 0.20, f"Expected ~10% error under 20% depolarizing noise, got {err}"

def test_qiskit_forged_state_measurement():
    qk_backend = QiskitBackend()
    # Signer expected |0> (Z basis), Attacker prepares |+>
    forged_state = qk_backend.get_pauli_state("|+>")
    meas = qk_backend.measure(forged_state, basis="Z", shots=2000, expected_outcome="0")
    err = meas["empirical_error_rate"]
    # In Z basis, |+> yields 50/50 measurement distribution (error ~50%)
    assert 0.40 <= err <= 0.60, f"Expected ~50% error for basis mismatch forgery, got {err}"
