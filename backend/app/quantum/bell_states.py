import numpy as np
from typing import Dict, Any, List
from app.quantum.statevector import Statevector
from app.quantum.gates import H, apply_1q_gate, apply_cnot, get_pauli_gate

# The 4 Maximally Entangled Bell States (EPR pairs)
# |Phi+> = (|00> + |11>)/sqrt(2)
# |Phi-> = (|00> - |11>)/sqrt(2)
# |Psi+> = (|01> + |10>)/sqrt(2)
# |Psi-> = (|01> - |10>)/sqrt(2)

BELL_STATE_VECTORS = {
    "Phi+": (1.0 / np.sqrt(2.0)) * np.array([1.0, 0.0, 0.0, 1.0], dtype=np.complex128),
    "Phi-": (1.0 / np.sqrt(2.0)) * np.array([1.0, 0.0, 0.0, -1.0], dtype=np.complex128),
    "Psi+": (1.0 / np.sqrt(2.0)) * np.array([0.0, 1.0, 1.0, 0.0], dtype=np.complex128),
    "Psi-": (1.0 / np.sqrt(2.0)) * np.array([0.0, 1.0, -1.0, 0.0], dtype=np.complex128),
}

def generate_bell_state(name: str = "Phi+") -> Statevector:
    """Generates the 2-qubit Statevector for a designated Bell state."""
    clean = name.replace("|", "").replace(">", "").strip()
    if clean not in BELL_STATE_VECTORS:
        raise ValueError(f"Unknown Bell state: '{name}'. Supported: {list(BELL_STATE_VECTORS.keys())}")
    return Statevector(BELL_STATE_VECTORS[clean], num_qubits=2)

def generate_bell_circuit_steps(name: str = "Phi+") -> List[Dict[str, Any]]:
    """
    Generates circuit step-by-step instructions and state evolutions for preparing a Bell state from |00>.
    |Phi+>: H(q0) -> CNOT(q0, q1)
    |Phi->: X(q0) -> H(q0) -> CNOT(q0, q1) OR H(q0) -> Z(q0) -> CNOT(q0, q1)
    |Psi+>: X(q1) -> H(q0) -> CNOT(q0, q1)
    |Psi->: X(q0) -> X(q1) -> H(q0) -> CNOT(q0, q1) OR H(q0) -> CNOT(q0, q1) -> Z(q0)
    """
    clean = name.replace("|", "").replace(">", "").strip()
    steps = []
    
    # Initial state |00>
    current = Statevector.from_label("00")
    steps.append({
        "step": 0,
        "name": "Initialization",
        "description": "Initialize both qubits in ground state |00>",
        "statevector": current.to_dict(),
        "circuit_gate": "INIT |00>"
    })

    if clean == "Phi+":
        # Step 1: H on q0
        current = apply_1q_gate(current, H, 0)
        steps.append({
            "step": 1,
            "name": "Hadamard Gate",
            "description": "Apply Hadamard on qubit 0 creating superposition (|0> + |1>)/sqrt(2) (x) |0>",
            "statevector": current.to_dict(),
            "circuit_gate": "H(q0)"
        })
        # Step 2: CNOT q0 -> q1
        current = apply_cnot(current, 0, 1)
        steps.append({
            "step": 2,
            "name": "CNOT Gate (Entanglement)",
            "description": "Apply CNOT with control q0 and target q1, generating maximally entangled |Phi+>",
            "statevector": current.to_dict(),
            "circuit_gate": "CNOT(q0, q1)"
        })
    elif clean == "Phi-":
        # Apply X on q0, then H on q0, then CNOT
        current = apply_1q_gate(current, get_pauli_gate("X"), 0)
        steps.append({
            "step": 1,
            "name": "Pauli-X Gate",
            "description": "Apply X on qubit 0 to prepare |10>",
            "statevector": current.to_dict(),
            "circuit_gate": "X(q0)"
        })
        current = apply_1q_gate(current, H, 0)
        steps.append({
            "step": 2,
            "name": "Hadamard Gate",
            "description": "Apply Hadamard on qubit 0 to prepare (|0> - |1>)/sqrt(2) (x) |0>",
            "statevector": current.to_dict(),
            "circuit_gate": "H(q0)"
        })
        current = apply_cnot(current, 0, 1)
        steps.append({
            "step": 3,
            "name": "CNOT Gate (Entanglement)",
            "description": "Apply CNOT with control q0 and target q1, generating |Phi->",
            "statevector": current.to_dict(),
            "circuit_gate": "CNOT(q0, q1)"
        })
    elif clean == "Psi+":
        # Apply X on q1, then H on q0, then CNOT
        current = apply_1q_gate(current, get_pauli_gate("X"), 1)
        steps.append({
            "step": 1,
            "name": "Pauli-X Gate",
            "description": "Apply X on qubit 1 to prepare |01>",
            "statevector": current.to_dict(),
            "circuit_gate": "X(q1)"
        })
        current = apply_1q_gate(current, H, 0)
        steps.append({
            "step": 2,
            "name": "Hadamard Gate",
            "description": "Apply Hadamard on qubit 0",
            "statevector": current.to_dict(),
            "circuit_gate": "H(q0)"
        })
        current = apply_cnot(current, 0, 1)
        steps.append({
            "step": 3,
            "name": "CNOT Gate (Entanglement)",
            "description": "Apply CNOT with control q0 and target q1, generating |Psi+>",
            "statevector": current.to_dict(),
            "circuit_gate": "CNOT(q0, q1)"
        })
    elif clean == "Psi-":
        # Apply X on q0 and q1, H on q0, CNOT
        current = apply_1q_gate(current, get_pauli_gate("X"), 0)
        current = apply_1q_gate(current, get_pauli_gate("X"), 1)
        steps.append({
            "step": 1,
            "name": "Pauli-X Gates",
            "description": "Apply X on both qubits to prepare |11>",
            "statevector": current.to_dict(),
            "circuit_gate": "X(q0), X(q1)"
        })
        current = apply_1q_gate(current, H, 0)
        steps.append({
            "step": 2,
            "name": "Hadamard Gate",
            "description": "Apply Hadamard on qubit 0",
            "statevector": current.to_dict(),
            "circuit_gate": "H(q0)"
        })
        current = apply_cnot(current, 0, 1)
        steps.append({
            "step": 3,
            "name": "CNOT Gate (Entanglement)",
            "description": "Apply CNOT with control q0 and target q1, generating |Psi->",
            "statevector": current.to_dict(),
            "circuit_gate": "CNOT(q0, q1)"
        })
    
    return steps

def list_bell_states() -> List[Dict[str, Any]]:
    """Metadata descriptions of the 4 Bell states"""
    return [
        {
            "name": "Phi+",
            "latex": "|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}",
            "description": "Even parity, symmetric Bell state (Standard default for teleportation)",
            "probabilities": {"00": 0.5, "01": 0.0, "10": 0.0, "11": 0.5},
            "concurrence": 1.0,
            "entropy": 1.0
        },
        {
            "name": "Phi-",
            "latex": "|\\Phi^-\\rangle = \\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}}",
            "description": "Even parity, antisymmetric phase Bell state",
            "probabilities": {"00": 0.5, "01": 0.0, "10": 0.0, "11": 0.5},
            "concurrence": 1.0,
            "entropy": 1.0
        },
        {
            "name": "Psi+",
            "latex": "|\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}}",
            "description": "Odd parity, symmetric Bell state",
            "probabilities": {"00": 0.0, "01": 0.5, "10": 0.5, "11": 0.0},
            "concurrence": 1.0,
            "entropy": 1.0
        },
        {
            "name": "Psi-",
            "latex": "|\\Psi^-\\rangle = \\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}}",
            "description": "Odd parity, singlet Bell state (rotational invariant)",
            "probabilities": {"00": 0.0, "01": 0.5, "10": 0.5, "11": 0.0},
            "concurrence": 1.0,
            "entropy": 1.0
        },
    ]
