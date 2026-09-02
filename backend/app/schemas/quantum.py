from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class BellStateRequest(BaseModel):
    name: str = Field(default="Phi+", description="Bell state name (Phi+, Phi-, Psi+, Psi-)")

class TeleportRequest(BaseModel):
    quantum_state: str = Field(default="|0>", description="Single qubit eigenstate to teleport (|0>, |1>, |+>, |->, |+i>, |-i>)")
    bell_state: str = Field(default="Phi+", description="Bell pair to use (Phi+, Phi-, Psi+, Psi-)")
    force_measurement_bits: Optional[str] = Field(default=None, description="Optional forced Alice measurement bits (00, 01, 10, 11)")

class MeasureRequest(BaseModel):
    quantum_state: str = Field(default="|0>", description="Qubit state to measure")
    basis: str = Field(default="Z", description="Measurement basis (Z, X, Y)")
    shots: int = Field(default=1000, ge=100, le=10000, description="Number of shots")
    noise_rate: float = Field(default=0.0, ge=0.0, le=1.0, description="Simulated channel noise rate")

class StatevectorSchema(BaseModel):
    num_qubits: int
    dimension: int
    basis_states: List[str]
    probabilities: List[float]
    amplitudes: List[Dict[str, float]]
    bloch: Optional[Dict[str, Any]] = None

class QuantumStepSchema(BaseModel):
    step: int
    name: str
    description: str
    circuit_gate: str
    statevector: Optional[Dict[str, Any]] = None
    measured_bits: Optional[str] = None
    pauli_correction: Optional[str] = None
    fidelity: Optional[float] = None
