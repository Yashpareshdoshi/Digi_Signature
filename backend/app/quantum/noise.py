import numpy as np
from typing import Dict, Any, Tuple
from app.quantum.statevector import Statevector
from app.quantum.gates import X, Z, apply_1q_gate

def apply_channel_noise(
    state: Statevector,
    noise_type: str = "depolarizing",
    noise_parameter: float = 0.1
) -> Tuple[Statevector, Dict[str, Any]]:
    """
    Simulates physical quantum channel noise models on a 1-qubit statevector.
    
    Models:
    - bit_flip: Applies Pauli-X with probability p
    - phase_flip: Applies Pauli-Z with probability p
    - depolarizing: Replaces state with random Pauli (X, Y, Z, I) with probability p
    - measurement_disturbance: Eve's intercept-resend attack or projective disturbance
    """
    noise_type = noise_type.lower()
    p = np.clip(noise_parameter, 0.0, 1.0)
    
    details = {
        "noise_type": noise_type,
        "noise_parameter": float(p),
        "operation_applied": "I"
    }
    
    if p <= 1e-9:
        return state, details

    rand = np.random.rand()
    
    if noise_type == "bit_flip":
        if rand < p:
            new_state = apply_1q_gate(state, X, 0)
            details["operation_applied"] = "X (Bit Flip Error)"
        else:
            new_state = state
            details["operation_applied"] = "I (No Error)"
            
    elif noise_type == "phase_flip":
        if rand < p:
            new_state = apply_1q_gate(state, Z, 0)
            details["operation_applied"] = "Z (Phase Flip Error)"
        else:
            new_state = state
            details["operation_applied"] = "I (No Error)"
            
    elif noise_type == "depolarizing":
        # Depolarizing channel: with prob (1-p) state is unchanged; with prob p/3 applies X, Y, or Z
        if rand < (1.0 - p):
            new_state = state
            details["operation_applied"] = "I"
        else:
            error_choice = np.random.choice(["X", "Y", "Z"])
            if error_choice == "X":
                new_state = apply_1q_gate(state, X, 0)
            elif error_choice == "Z":
                new_state = apply_1q_gate(state, Z, 0)
            else: # Y
                new_state = apply_1q_gate(state, np.array([[0, -1j], [1j, 0]], dtype=np.complex128), 0)
            details["operation_applied"] = f"{error_choice} (Depolarizing Error)"
            
    elif noise_type in ("measurement_disturbance", "intercept_resend"):
        # Eve measures in random basis (e.g. X or Z), causing wave function collapse
        eve_basis = np.random.choice(["Z", "X"])
        details["operation_applied"] = f"Eve Intercept-Resend in {eve_basis} Basis"
        if eve_basis == "Z":
            p0 = np.abs(state.data[0]) ** 2
            collapse_0 = (rand < p0)
            collapsed_vec = np.array([1.0, 0.0] if collapse_0 else [0.0, 1.0], dtype=np.complex128)
        else:
            # X basis (+ / -)
            p_plus = np.abs(np.dot(np.array([1.0, 1.0]) / np.sqrt(2), state.data)) ** 2
            collapse_plus = (rand < p_plus)
            collapsed_vec = np.array([1.0, 1.0] if collapse_plus else [1.0, -1.0], dtype=np.complex128) / np.sqrt(2.0)
        new_state = Statevector(collapsed_vec, num_qubits=1)
    else:
        new_state = state
        details["operation_applied"] = f"Unknown noise '{noise_type}' -> I"
        
    return new_state, details
