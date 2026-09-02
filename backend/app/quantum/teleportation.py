import numpy as np
import random
from typing import Dict, Any, List, Tuple
from app.quantum.statevector import Statevector
from app.quantum.gates import H, apply_1q_gate, apply_cnot, get_pauli_gate, I2, X, Z
from app.quantum.bell_states import generate_bell_state

def simulate_teleportation(
    input_state: Statevector,
    bell_state_name: str = "Phi+",
    force_measurement_bits: str = None
) -> Dict[str, Any]:
    """
    Simulates the full Quantum Teleportation protocol of a 1-qubit quantum state from Alice to Bob.
    
    Protocol Flow:
    1. Input State Preparation: Alice holds qubit 0 in unknown state |psi> = alpha|0> + beta|1>
    2. Entangled Pair Generation: Alice and Bob share an EPR pair on qubits 1 & 2 (e.g. |Phi+>)
    3. Joint 3-qubit state: |Psi0> = |psi>_0 (x) |Bell>_12
    4. Alice's Bell Measurement: Alice applies CNOT(q0 -> q1) followed by H(q0)
    5. Measurement: Alice measures qubits 0 and 1 in computational basis -> 2 classical bits (b0, b1)
    6. Classical Communication: Alice transmits classical bits (b0, b1) to Bob
    7. Pauli Correction: Bob applies unitary correction U = Z^b0 * X^b1 on qubit 2
    8. Verification: Bob's recovered qubit state |psi'> has fidelity F = 1.0 with Alice's input state.
    """
    if input_state.num_qubits != 1:
        raise ValueError("Input state for teleportation must be a single qubit.")
    
    steps = []
    
    # Step 1: Input state |psi>
    steps.append({
        "step": 1,
        "name": "Input Qubit Preparation",
        "description": "Alice prepares message quantum state |psi> on qubit 0",
        "statevector": input_state.to_dict(),
        "circuit_gate": "INPUT |psi> (q0)"
    })
    
    # Step 2: Shared Bell pair on qubits 1 & 2
    bell_pair = generate_bell_state(bell_state_name)
    steps.append({
        "step": 2,
        "name": "EPR Pair Distribution",
        "description": f"Alice (q1) and Bob (q2) share entangled Bell pair |{bell_state_name}>",
        "statevector": bell_pair.to_dict(),
        "circuit_gate": f"BELL_PAIR |{bell_state_name}> (q1, q2)"
    })
    
    # Step 3: Total 3-qubit system |Psi0> = |psi>_0 (x) |Bell>_12
    total_state = input_state.tensor(bell_pair)
    steps.append({
        "step": 3,
        "name": "Joint System Construction",
        "description": "Composite 3-qubit statevector before Alice's operations",
        "statevector": total_state.to_dict(),
        "circuit_gate": "SYSTEM_INIT (q0, q1, q2)"
    })
    
    # Step 4a: Alice applies CNOT(q0 -> q1)
    state_after_cnot = apply_cnot(total_state, 0, 1)
    steps.append({
        "step": 4,
        "name": "Alice CNOT Operation",
        "description": "Alice performs CNOT entangling her message qubit q0 with her EPR half q1",
        "statevector": state_after_cnot.to_dict(),
        "circuit_gate": "CNOT(q0, q1)"
    })
    
    # Step 4b: Alice applies Hadamard H on q0
    state_after_h = apply_1q_gate(state_after_cnot, H, 0)
    steps.append({
        "step": 5,
        "name": "Alice Hadamard Operation",
        "description": "Alice applies Hadamard gate on qubit q0 to complete Bell-basis rotation",
        "statevector": state_after_h.to_dict(),
        "circuit_gate": "H(q0)"
    })
    
    # Step 5: Alice's Projective Measurement on q0 and q1
    # Each outcome (00, 01, 10, 11) occurs with probability 0.25
    probs = state_after_h.probabilities()
    # Marginal probabilities for (q0, q1): sum over q2 (0 and 1)
    # basis index = (q0 << 2) + (q1 << 1) + q2
    prob_00 = probs[0] + probs[1] # |000> + |001>
    prob_01 = probs[2] + probs[3] # |010> + |011>
    prob_10 = probs[4] + probs[5] # |100> + |101>
    prob_11 = probs[6] + probs[7] # |110> + |111>
    
    outcome_probs = {"00": float(prob_00), "01": float(prob_01), "10": float(prob_10), "11": float(prob_11)}
    
    if force_measurement_bits and force_measurement_bits in outcome_probs:
        measured_bits = force_measurement_bits
    else:
        outcomes = ["00", "01", "10", "11"]
        p_weights = [outcome_probs[o] for o in outcomes]
        # Normalize weights in case of numerical noise
        p_sum = sum(p_weights)
        p_norm = [p / p_sum for p in p_weights]
        measured_bits = np.random.choice(outcomes, p=p_norm)
    
    b0 = int(measured_bits[0]) # measurement of q0
    b1 = int(measured_bits[1]) # measurement of q1
    
    # Extract Bob's post-measurement state on qubit 2
    # Before correction, Bob's unnormalized amplitudes are in indices matching (b0, b1, :)
    idx_0 = (b0 << 2) + (b1 << 1) + 0
    idx_1 = (b0 << 2) + (b1 << 1) + 1
    bob_raw_vector = np.array([state_after_h.data[idx_0], state_after_h.data[idx_1]], dtype=np.complex128)
    bob_state_before_correction = Statevector(bob_raw_vector, num_qubits=1)
    
    steps.append({
        "step": 6,
        "name": "Alice Bell Measurement",
        "description": f"Alice measures (q0, q1) -> Classical Bits '{measured_bits}' (Outcome: b0={b0}, b1={b1})",
        "measured_bits": measured_bits,
        "outcome_probabilities": outcome_probs,
        "bob_state_before_correction": bob_state_before_correction.to_dict(),
        "circuit_gate": f"MEASURE(q0, q1) => '{measured_bits}'"
    })
    
    # Step 6: Pauli Correction Selection
    # Standard Teleportation Pauli Correction: U_Bob = Z^b0 * X^b1
    if measured_bits == "00":
        pauli_correction_name = "I"
        correction_matrix = I2
    elif measured_bits == "01":
        pauli_correction_name = "X"
        correction_matrix = X
    elif measured_bits == "10":
        pauli_correction_name = "Z"
        correction_matrix = Z
    elif measured_bits == "11":
        pauli_correction_name = "ZX (or -iY)"
        correction_matrix = Z @ X
    else:
        pauli_correction_name = "I"
        correction_matrix = I2
        
    recovered_data = correction_matrix @ bob_state_before_correction.data
    recovered_state = Statevector(recovered_data, num_qubits=1)
    
    # Compute fidelity between Alice's input state and Bob's recovered state
    teleportation_fidelity = input_state.fidelity(recovered_state)
    
    steps.append({
        "step": 7,
        "name": "Bob Pauli Correction & Recovery",
        "description": f"Bob applies Pauli correction operator '{pauli_correction_name}' on qubit 2 based on Alice's classical bits '{measured_bits}'",
        "pauli_correction": pauli_correction_name,
        "recovered_state": recovered_state.to_dict(),
        "fidelity": float(teleportation_fidelity),
        "circuit_gate": f"PAULI_CORRECTION({pauli_correction_name})"
    })
    
    return {
        "bell_state_used": bell_state_name,
        "classical_bits": measured_bits,
        "pauli_correction": pauli_correction_name,
        "input_state": input_state.to_dict(),
        "recovered_state": recovered_state.to_dict(),
        "fidelity": float(teleportation_fidelity),
        "steps": steps
    }
