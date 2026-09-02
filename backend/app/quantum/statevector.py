import numpy as np
from typing import List, Tuple, Dict, Any

class Statevector:
    """
    Exact N-qubit quantum statevector representation using NumPy complex arrays.
    Dimension of statevector is 2^n.
    """
    def __init__(self, data: np.ndarray, num_qubits: int = None):
        data = np.asarray(data, dtype=np.complex128).flatten()
        dim = len(data)
        if (dim & (dim - 1)) != 0 or dim == 0:
            raise ValueError(f"Statevector dimension {dim} must be a power of 2.")
        
        self.num_qubits = int(np.log2(dim)) if num_qubits is None else num_qubits
        if 2 ** self.num_qubits != dim:
            raise ValueError(f"Number of qubits {self.num_qubits} does not match dimension {dim}")
        
        # Normalize statevector
        norm = np.linalg.norm(data)
        if norm < 1e-12:
            raise ValueError("Statevector norm is zero.")
        self.data = data / norm

    @classmethod
    def from_label(cls, label: str) -> "Statevector":
        """Initialize from computational basis label e.g., '0', '1', '00', '101'"""
        num_qubits = len(label)
        dim = 2 ** num_qubits
        idx = int(label, 2)
        vec = np.zeros(dim, dtype=np.complex128)
        vec[idx] = 1.0
        return cls(vec, num_qubits=num_qubits)

    def probabilities(self) -> np.ndarray:
        """Returns Born rule probability distribution p_i = |a_i|^2"""
        return np.abs(self.data) ** 2

    def inner_product(self, other: "Statevector") -> complex:
        """Computes inner product <self|other>"""
        if self.num_qubits != other.num_qubits:
            raise ValueError("Statevectors must have same number of qubits.")
        return np.vdot(self.data, other.data)

    def fidelity(self, other: "Statevector") -> float:
        """Computes quantum fidelity F = |<self|other>|^2"""
        return float(np.abs(self.inner_product(other)) ** 2)

    def tensor(self, other: "Statevector") -> "Statevector":
        """Kronecker tensor product self (x) other"""
        new_data = np.kron(self.data, other.data)
        return Statevector(new_data, self.num_qubits + other.num_qubits)

    def to_bloch_angles(self) -> Tuple[float, float]:
        """
        For a single-qubit state |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>,
        computes spherical Bloch coordinates (theta, phi) in radians.
        """
        if self.num_qubits != 1:
            raise ValueError("Bloch angles only defined for 1-qubit states.")
        a = self.data[0]
        b = self.data[1]
        
        # Remove global phase such that a is real and positive
        if np.abs(a) > 1e-9:
            phase = np.angle(a)
            a = a * np.exp(-1j * phase)
            b = b * np.exp(-1j * phase)
        
        theta = 2.0 * np.arccos(np.clip(np.abs(a), 0.0, 1.0))
        phi = np.angle(b) if np.abs(b) > 1e-9 else 0.0
        if phi < 0:
            phi += 2 * np.pi
        return float(theta), float(phi)

    def to_dict(self) -> Dict[str, Any]:
        """Returns JSON-serializable representation"""
        probs = self.probabilities()
        basis_states = [format(i, f"0{self.num_qubits}b") for i in range(len(self.data))]
        amplitudes = [
            {"real": float(self.data[i].real), "imag": float(self.data[i].imag)}
            for i in range(len(self.data))
        ]
        res = {
            "num_qubits": self.num_qubits,
            "dimension": len(self.data),
            "basis_states": basis_states,
            "probabilities": [float(p) for p in probs],
            "amplitudes": amplitudes,
        }
        if self.num_qubits == 1:
            theta, phi = self.to_bloch_angles()
            res["bloch"] = {
                "theta": theta,
                "phi": phi,
                "theta_deg": float(np.degrees(theta)),
                "phi_deg": float(np.degrees(phi)),
                "x": float(np.sin(theta) * np.cos(phi)),
                "y": float(np.sin(theta) * np.sin(phi)),
                "z": float(np.cos(theta)),
            }
        return res
