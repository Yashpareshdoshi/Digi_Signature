from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple
from app.quantum.statevector import Statevector

class QuantumBackend(ABC):
    """
    Abstract Base Class for Quantum Simulation Backends.
    Allows seamless switching between pure NumPy reference simulation
    and Qiskit Aer circuit-based simulation.
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Returns the unique identifier name of the backend."""
        pass

    @abstractmethod
    def get_pauli_state(self, label: str) -> Statevector:
        """Returns the Statevector for a given Pauli eigenstate label."""
        pass

    @abstractmethod
    def create_bell_state(self, bell_state_name: str = "Phi+") -> Statevector:
        """Generates a 2-qubit Bell state EPR pair."""
        pass

    @abstractmethod
    def teleport(
        self,
        input_state: Statevector,
        bell_state_name: str = "Phi+",
        force_measurement_bits: Optional[str] = None,
        shots: int = 1024
    ) -> Dict[str, Any]:
        """
        Executes 3-qubit quantum teleportation protocol.
        Must return a dict with:
          - 'classical_bits': str (e.g. '01')
          - 'pauli_correction': str (e.g. 'X')
          - 'recovered_statevector': Statevector
          - 'recovered_state': dict
          - 'fidelity': float
          - 'steps': list
        """
        pass

    @abstractmethod
    def apply_channel_noise(
        self,
        state: Statevector,
        noise_type: str = "depolarizing",
        noise_parameter: float = 0.1
    ) -> Tuple[Statevector, Dict[str, Any]]:
        """Applies physical channel noise / decoherence to a 1-qubit state."""
        pass

    @abstractmethod
    def measure(
        self,
        state: Statevector,
        basis: str = "Z",
        shots: int = 1000,
        expected_outcome: Optional[str] = None,
        noise_rate: float = 0.0
    ) -> Dict[str, Any]:
        """Performs projective measurements across designated basis."""
        pass

    @abstractmethod
    def calculate_fidelity(self, state_a: Statevector, state_b: Statevector) -> float:
        """Calculates quantum fidelity |<a|b>|^2 between two states."""
        pass
