from typing import Dict, Any, Optional, Tuple
from app.quantum.backend import QuantumBackend
from app.quantum.statevector import Statevector
from app.quantum.pauli import get_pauli_eigenstate
from app.quantum.bell_states import generate_bell_state
from app.quantum.teleportation import simulate_teleportation
from app.quantum.noise import apply_channel_noise
from app.quantum.measurement import sample_projective_measurements

class NumpyBackend(QuantumBackend):
    """
    Reference Quantum Simulation Backend.
    Uses exact NumPy statevector linear algebra on C^2 and C^8.
    Zero external quantum SDK dependencies; mathematically transparent and deterministic.
    """

    @property
    def name(self) -> str:
        return "numpy"

    def get_pauli_state(self, label: str) -> Statevector:
        return get_pauli_eigenstate(label)

    def create_bell_state(self, bell_state_name: str = "Phi+") -> Statevector:
        return generate_bell_state(bell_state_name)

    def teleport(
        self,
        input_state: Statevector,
        bell_state_name: str = "Phi+",
        force_measurement_bits: Optional[str] = None,
        shots: int = 1024
    ) -> Dict[str, Any]:
        return simulate_teleportation(
            input_state=input_state,
            bell_state_name=bell_state_name,
            force_measurement_bits=force_measurement_bits
        )

    def apply_channel_noise(
        self,
        state: Statevector,
        noise_type: str = "depolarizing",
        noise_parameter: float = 0.1
    ) -> Tuple[Statevector, Dict[str, Any]]:
        return apply_channel_noise(
            state=state,
            noise_type=noise_type,
            noise_parameter=noise_parameter
        )

    def measure(
        self,
        state: Statevector,
        basis: str = "Z",
        shots: int = 1000,
        expected_outcome: Optional[str] = None,
        noise_rate: float = 0.0
    ) -> Dict[str, Any]:
        return sample_projective_measurements(
            state=state,
            basis=basis,
            shots=shots,
            expected_outcome=expected_outcome,
            noise_rate=noise_rate
        )

    def calculate_fidelity(self, state_a: Statevector, state_b: Statevector) -> float:
        return state_a.fidelity(state_b)
