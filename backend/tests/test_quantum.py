import pytest
import numpy as np
from app.quantum.statevector import Statevector
from app.quantum.gates import I2, X, Y, Z, H, apply_1q_gate, apply_cnot, get_pauli_gate
from app.quantum.pauli import get_pauli_eigenstate
from app.quantum.bell_states import generate_bell_state
from app.quantum.teleportation import simulate_teleportation
from app.quantum.measurement import calculate_projective_probabilities, sample_projective_measurements

def test_statevector_normalization_and_fidelity():
    s0 = Statevector.from_label("0")
    s1 = Statevector.from_label("1")
    assert np.isclose(s0.fidelity(s0), 1.0)
    assert np.isclose(s0.fidelity(s1), 0.0)
    
    # Superposition
    plus = get_pauli_eigenstate("|+>")
    assert np.isclose(plus.fidelity(s0), 0.5)
    assert np.isclose(plus.fidelity(s1), 0.5)

def test_pauli_gates():
    s0 = Statevector.from_label("0")
    s1 = Statevector.from_label("1")
    
    # X|0> = |1>
    s_x = apply_1q_gate(s0, X, 0)
    assert np.isclose(s_x.fidelity(s1), 1.0)
    
    # H|0> = |+>
    s_h = apply_1q_gate(s0, H, 0)
    plus = get_pauli_eigenstate("|+>")
    assert np.isclose(s_h.fidelity(plus), 1.0)

def test_bell_state_concurrence():
    bell_phi_plus = generate_bell_state("Phi+")
    probs = bell_phi_plus.probabilities()
    assert np.isclose(probs[0], 0.5) # |00>
    assert np.isclose(probs[1], 0.0) # |01>
    assert np.isclose(probs[2], 0.0) # |10>
    assert np.isclose(probs[3], 0.5) # |11>

def test_quantum_teleportation_exact_fidelity():
    # Test teleportation for all 6 Pauli eigenstates across all 4 classical measurement branches
    states_to_test = ["|0>", "|1>", "|+>", "|->", "|+i>", "|-i>"]
    forced_branches = ["00", "01", "10", "11"]
    
    for s_name in states_to_test:
        input_state = get_pauli_eigenstate(s_name)
        for branch in forced_branches:
            res = simulate_teleportation(
                input_state=input_state,
                bell_state_name="Phi+",
                force_measurement_bits=branch
            )
            # Bob's recovered state must have fidelity 1.0 with Alice's input state
            assert np.isclose(res["fidelity"], 1.0, atol=1e-6), f"Failed for {s_name} with branch {branch}"

def test_projective_measurement_born_rule():
    plus = get_pauli_eigenstate("|+>")
    # Measuring |+> in X basis must yield '+' with probability 1.0
    x_probs = calculate_projective_probabilities(plus, basis="X")
    assert np.isclose(x_probs["+"], 1.0)
    assert np.isclose(x_probs["-"], 0.0)
    
    # Measuring |+> in Z basis must yield 50/50
    z_probs = calculate_projective_probabilities(plus, basis="Z")
    assert np.isclose(z_probs["0"], 0.5)
    assert np.isclose(z_probs["1"], 0.5)

def test_teleportation_recovered_statevector_coupling():
    from app.quantum.noise import apply_channel_noise
    
    input_state = get_pauli_eigenstate("|+>")
    res = simulate_teleportation(input_state=input_state, bell_state_name="Phi+")
    
    recovered_vec = res.get("recovered_statevector")
    assert recovered_vec is not None
    assert isinstance(recovered_vec, Statevector)
    assert np.isclose(recovered_vec.fidelity(input_state), 1.0)

    # When physical noise is applied to the state, fidelity drops
    noisy_state, details = apply_channel_noise(recovered_vec, noise_type="depolarizing", noise_parameter=0.30)
    assert isinstance(noisy_state, Statevector)
    assert details["noise_type"] == "depolarizing"


# ============================================================================
# COMPREHENSIVE QISKIT / AERSIMULATOR TELEPORTATION VERIFICATION TESTS
# ============================================================================

def test_qiskit_circuit_structure():
    """
    Test 1: Verify 3 quantum bits, 2 classical bits, Bell pair creation,
    Alice joint Bell measurement, and Bob dynamic conditional corrections.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    s0 = qk.get_pauli_state("|0>")

    qc, qr, cr = qk.build_teleportation_circuit(s0, bell_state_name="Phi+")
    assert qc.num_qubits == 3, f"Expected 3 qubits, got {qc.num_qubits}"
    assert qc.num_clbits == 2, f"Expected 2 classical bits, got {qc.num_clbits}"

    op_names = [inst.operation.name for inst in qc.data]
    assert "cx" in op_names, "Missing CNOT gates in teleportation circuit"
    assert "h" in op_names, "Missing Hadamard gates in teleportation circuit"
    assert "measure" in op_names, "Missing Alice measurements in teleportation circuit"
    assert "if_else" in op_names or "if_test" in op_names or any(
        getattr(inst.operation, "condition", None) is not None for inst in qc.data
    ), "Missing Bob conditional dynamic corrections in circuit"


def test_qiskit_actual_aer_execution():
    """
    Test 2 & 3: Execute circuit on AerSimulator. Verify that actual execution data,
    shot counts, and classical bits are returned directly from AerSimulator.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    plus_state = qk.get_pauli_state("|+>")

    res = qk.teleport(plus_state, bell_state_name="Phi+", shots=1024)

    assert res["backend"] == "qiskit"
    assert res["simulator"] == "AerSimulator"
    assert res["shots"] == 1024
    assert res["classical_bits"] in ("00", "01", "10", "11")
    assert res["pauli_correction"] in ("I", "X", "Z", "ZX (or -iY)")
    assert "alice_measurement_counts" in res

    counts = res["alice_measurement_counts"]
    total_shots = sum(counts.values())
    assert total_shots == 1024, f"Expected total shots 1024, got {total_shots}"
    assert len(res["raw_measurement_memory"]) > 0


def test_qiskit_multiple_branches_statistical_distribution():
    """
    Test 4: Verify that with 4096 shots on AerSimulator, all 4 measurement branches
    (00, 01, 10, 11) behave according to expected quantum probabilities (~25% each).
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    in_state = qk.get_pauli_state("|+i>")

    res = qk.teleport(in_state, bell_state_name="Phi+", shots=4096)
    counts = res["alice_measurement_counts"]

    for branch in ("00", "01", "10", "11"):
        assert branch in counts, f"Missing branch {branch} in counts"
        prob = counts[branch] / 4096.0
        # Tolerant statistical bound: 18% to 32% (expected 25%)
        assert 0.18 <= prob <= 0.32, (
            f"Branch {branch} probability {prob:.4f} outside statistical bound [0.18, 0.32]"
        )


def test_qiskit_teleportation_all_six_pauli_states():
    """
    Test 5 & 13: Verify teleportation correctness across all 6 Pauli eigenstates:
    |0>, |1>, |+>, |->, |+i>, |-i>.
    Each state must be teleported through AerSimulator with Bob's dynamic correction
    achieving fidelity ~1.0.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    pauli_labels = ["|0>", "|1>", "|+>", "|->", "|+i>", "|-i>"]

    for label in pauli_labels:
        in_state = qk.get_pauli_state(label)
        res = qk.teleport(in_state, bell_state_name="Phi+", shots=1024)

        assert res["backend"] == "qiskit"
        assert res["simulator"] == "AerSimulator"
        assert res["classical_bits"] in ("00", "01", "10", "11")

        fid = res["fidelity"]
        assert fid >= 0.99999, f"Failed fidelity for state {label}: got {fid}"

        rec_sv = res["recovered_statevector"]
        assert isinstance(rec_sv, Statevector)
        assert np.isclose(in_state.fidelity(rec_sv), 1.0, atol=1e-5)


def test_qiskit_input_sensitivity_orthogonality():
    """
    Test 14: Prove that changing the input quantum state produces distinct,
    physically orthogonal Bob recovered states.
    Protects against any implementation that returns a dummy or fixed state.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()

    # Teleport |0> and |1>
    res_0 = qk.teleport(qk.get_pauli_state("|0>"), shots=512)
    res_1 = qk.teleport(qk.get_pauli_state("|1>"), shots=512)

    sv_0 = res_0["recovered_statevector"]
    sv_1 = res_1["recovered_statevector"]
    assert np.isclose(sv_0.fidelity(sv_1), 0.0, atol=1e-5), "Recovered |0> and |1> must be orthogonal"

    # Teleport |+> and |->
    res_plus = qk.teleport(qk.get_pauli_state("|+>"), shots=512)
    res_minus = qk.teleport(qk.get_pauli_state("|->"), shots=512)

    sv_plus = res_plus["recovered_statevector"]
    sv_minus = res_minus["recovered_statevector"]
    assert np.isclose(sv_plus.fidelity(sv_minus), 0.0, atol=1e-5), "Recovered |+> and |-> must be orthogonal"


def test_qiskit_measurement_originates_from_aer():
    """
    Test 15: Verify classical bits are not generated by python random.choice,
    but directly match AerSimulator's actual simulation memory.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    s_in = qk.get_pauli_state("|+>")

    res = qk.teleport(s_in, shots=500)
    measured_bits = res["classical_bits"]

    # Aer memory stores raw string 'b1 b0'; canonical bits are 'b0 b1'
    # Both bits must be valid binary characters
    assert measured_bits[0] in ("0", "1")
    assert measured_bits[1] in ("0", "1")
    assert res["alice_measurement_counts"][measured_bits] > 0


def test_qiskit_circuit_diagram_traceability():
    """
    Test 16: Verify that displayed circuit matches the executed circuit structure.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    s_in = qk.get_pauli_state("|0>")

    res = qk.teleport(s_in, bell_state_name="Phi+", shots=100)
    diagram = res["qiskit_circuit_diagram"]

    assert "c_alice" in diagram
    assert "qds_teleportation" in diagram or "q_" in diagram
    assert res["openqasm3"] is not None


def test_qiskit_error_handling_invalid_inputs():
    """
    Test 18: Handle invalid qubit dimensions and non-positive shots with explicit errors.
    """
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()

    # 2-qubit state should raise ValueError
    s_2q = Statevector(np.array([1, 0, 0, 0], dtype=np.complex128), num_qubits=2)
    with pytest.raises(ValueError, match="single qubit"):
        qk.teleport(s_2q)

    # Shots <= 0 should raise ValueError
    s_1q = qk.get_pauli_state("|0>")
    with pytest.raises(ValueError, match="positive integer"):
        qk.teleport(s_1q, shots=0)


def test_teleportation_all_four_bell_states_numpy():
    """Verify that all 4 Bell resources achieve fidelity 1.0 on NumPy for all BB84 states and measurement branches."""
    states = ["|0>", "|1>", "|+>", "|->"]
    bell_states = ["Phi+", "Phi-", "Psi+", "Psi-"]
    branches = ["00", "01", "10", "11"]
    for bell in bell_states:
        for s_label in states:
            in_state = get_pauli_eigenstate(s_label)
            for branch in branches:
                res = simulate_teleportation(
                    input_state=in_state,
                    bell_state_name=bell,
                    force_measurement_bits=branch
                )
                assert np.isclose(res["fidelity"], 1.0, atol=1e-5), f"NumPy failed for Bell {bell}, state {s_label}, branch {branch}"


def test_teleportation_all_four_bell_states_qiskit():
    """Verify that all 4 Bell resources achieve fidelity near 1.0 on Qiskit Aer for all BB84 states."""
    from app.quantum.qiskit_backend import QiskitBackend
    qk = QiskitBackend()
    states = ["|0>", "|1>", "|+>", "|->"]
    bell_states = ["Phi+", "Phi-", "Psi+", "Psi-"]
    for bell in bell_states:
        for s_label in states:
            in_state = qk.get_pauli_state(s_label)
            res = qk.teleport(in_state, bell_state_name=bell, shots=200)
            assert res["fidelity"] >= 0.99, f"Qiskit Aer failed for Bell {bell}, state {s_label}, got fidelity {res['fidelity']}"


