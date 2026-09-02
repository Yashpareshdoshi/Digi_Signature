import numpy as np
from app.quantum.statevector import Statevector

# Standard 1-qubit Gate Matrices
I2 = np.eye(2, dtype=np.complex128)
X = np.array([[0, 1], [1, 0]], dtype=np.complex128)
Y = np.array([[0, -1j], [1j, 0]], dtype=np.complex128)
Z = np.array([[1, 0], [0, -1]], dtype=np.complex128)
H = (1.0 / np.sqrt(2.0)) * np.array([[1, 1], [1, -1]], dtype=np.complex128)
S = np.array([[1, 0], [0, 1j]], dtype=np.complex128)
T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4.0)]], dtype=np.complex128)

# Standard 2-qubit CNOT (Control = 0, Target = 1 in standard 2-qubit basis |00>, |01>, |10>, |11>)
CNOT_01 = np.array([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0]
], dtype=np.complex128)

def get_pauli_gate(name: str) -> np.ndarray:
    """Returns 2x2 Pauli matrix by symbol ('I', 'X', 'Y', 'Z')"""
    name = name.upper()
    if name == 'I':
        return I2
    elif name == 'X':
        return X
    elif name == 'Y':
        return Y
    elif name == 'Z':
        return Z
    elif name in ('XZ', 'ZX'):
        # Bob's 11 correction: Z @ X
        return Z @ X
    else:
        raise ValueError(f"Unknown Pauli gate: {name}")

def apply_1q_gate(state: Statevector, gate: np.ndarray, target_qubit: int) -> Statevector:
    """
    Applies a 2x2 unitary gate to a specific target qubit in an n-qubit Statevector.
    Qubits are indexed from 0 (most significant) to n-1 (least significant).
    """
    n = state.num_qubits
    if target_qubit < 0 or target_qubit >= n:
        raise ValueError(f"Target qubit {target_qubit} out of range [0, {n-1}]")
    
    # Construct full 2^n x 2^n unitary via Kronecker products
    ops = []
    for q in range(n):
        if q == target_qubit:
            ops.append(gate)
        else:
            ops.append(I2)
    
    full_u = ops[0]
    for op in ops[1:]:
        full_u = np.kron(full_u, op)
    
    new_data = full_u @ state.data
    return Statevector(new_data, num_qubits=n)

def apply_cnot(state: Statevector, control: int, target: int) -> Statevector:
    """
    Applies CNOT (CX) gate with arbitrary control and target qubit indices in an n-qubit system.
    """
    n = state.num_qubits
    if control == target or control < 0 or control >= n or target < 0 or target >= n:
        raise ValueError(f"Invalid control {control} or target {target} for {n} qubits")
    
    # Projector P0 = |0><0| on control + I on target
    # Projector P1 = |1><1| on control + X on target
    P0 = np.array([[1, 0], [0, 0]], dtype=np.complex128)
    P1 = np.array([[0, 0], [0, 1]], dtype=np.complex128)

    ops_0 = []
    ops_1 = []
    for q in range(n):
        if q == control:
            ops_0.append(P0)
            ops_1.append(P1)
        elif q == target:
            ops_0.append(I2)
            ops_1.append(X)
        else:
            ops_0.append(I2)
            ops_1.append(I2)
    
    u0 = ops_0[0]
    u1 = ops_1[0]
    for op0, op1 in zip(ops_0[1:], ops_1[1:]):
        u0 = np.kron(u0, op0)
        u1 = np.kron(u1, op1)
    
    full_cnot = u0 + u1
    new_data = full_cnot @ state.data
    return Statevector(new_data, num_qubits=n)
