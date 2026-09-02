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
