import numpy as np
from typing import Dict, Any, List
from app.quantum.statevector import Statevector

# Pauli Eigenstates
# Z Basis: |0>, |1>
# X Basis: |+>, |->
# Y Basis: |+i>, |-i>

PAULI_STATES = {
    "|0>": np.array([1.0, 0.0], dtype=np.complex128),
    "|1>": np.array([0.0, 1.0], dtype=np.complex128),
    "|+>": (1.0 / np.sqrt(2.0)) * np.array([1.0, 1.0], dtype=np.complex128),
    "|->": (1.0 / np.sqrt(2.0)) * np.array([1.0, -1.0], dtype=np.complex128),
    "|+i>": (1.0 / np.sqrt(2.0)) * np.array([1.0, 1.0j], dtype=np.complex128),
    "|-i>": (1.0 / np.sqrt(2.0)) * np.array([1.0, -1.0j], dtype=np.complex128),
}

def get_pauli_eigenstate(name: str) -> Statevector:
    """Returns 1-qubit Statevector for a given eigenstate name e.g. '|0>', '|+>', etc."""
    cleaned = name.strip()
    if not cleaned.startswith("|"):
        cleaned = f"|{cleaned}"
    if not cleaned.endswith(">"):
        cleaned = f"{cleaned}>"
    
    if cleaned not in PAULI_STATES:
        raise ValueError(f"Unknown Pauli eigenstate '{name}'. Valid states: {list(PAULI_STATES.keys())}")
    
    return Statevector(PAULI_STATES[cleaned], num_qubits=1)

def list_supported_states() -> List[Dict[str, Any]]:
    """Lists all supported Pauli eigenstates with basis and Dirac notation metadata"""
    return [
        {
            "label": "|0>",
            "basis": "Z",
            "eigenvalue": "+1",
            "latex": "|0\\rangle",
            "description": "Computational ground state (Z-basis eigenstate with eigenvalue +1)"
        },
        {
            "label": "|1>",
            "basis": "Z",
            "eigenvalue": "-1",
            "latex": "|1\\rangle",
            "description": "Computational excited state (Z-basis eigenstate with eigenvalue -1)"
        },
        {
            "label": "|+>",
            "basis": "X",
            "eigenvalue": "+1",
            "latex": "|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}",
            "description": "Superposition state (X-basis eigenstate with eigenvalue +1)"
        },
        {
            "label": "|->",
            "basis": "X",
            "eigenvalue": "-1",
            "latex": "|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}",
            "description": "Superposition state (X-basis eigenstate with eigenvalue -1)"
        },
        {
            "label": "|+i>",
            "basis": "Y",
            "eigenvalue": "+1",
            "latex": "|+i\\rangle = \\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}",
            "description": "Complex phase superposition state (Y-basis eigenstate with eigenvalue +1)"
        },
        {
            "label": "|-i>",
            "basis": "Y",
            "eigenvalue": "-1",
            "latex": "|-i\\rangle = \\frac{|0\\rangle - i|1\\rangle}{\\sqrt{2}}",
            "description": "Complex phase superposition state (Y-basis eigenstate with eigenvalue -1)"
        },
    ]
