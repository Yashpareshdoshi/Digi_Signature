from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.quantum import BellStateRequest, TeleportRequest, MeasureRequest
from app.quantum.bell_states import generate_bell_state, generate_bell_circuit_steps, list_bell_states
from app.quantum.teleportation import simulate_teleportation
from app.quantum.pauli import get_pauli_eigenstate, list_supported_states
from app.quantum.measurement import sample_projective_measurements, calculate_projective_probabilities

router = APIRouter(prefix="/quantum", tags=["Quantum Simulation"])

@router.get("/states", response_model=List[Dict[str, Any]])
def get_supported_states():
    """List supported Pauli eigenstates (|0>, |1>, |+>, |->, |+i>, |-i>)."""
    return list_supported_states()

@router.get("/bell-states", response_model=List[Dict[str, Any]])
def get_bell_states():
    """List supported Bell states and their mathematical properties."""
    return list_bell_states()

@router.post("/bell-state")
def create_bell_state(payload: BellStateRequest):
    """Generate a Bell state with step-by-step circuit trace."""
    try:
        steps = generate_bell_circuit_steps(payload.name)
        bell_vec = generate_bell_state(payload.name)
        return {
            "name": payload.name,
            "final_statevector": bell_vec.to_dict(),
            "circuit_steps": steps
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/teleport")
def run_teleportation(payload: TeleportRequest):
    """Simulate complete 3-qubit Quantum Teleportation circuit with Pauli correction."""
    try:
        input_state = get_pauli_eigenstate(payload.quantum_state)
        res = simulate_teleportation(
            input_state=input_state,
            bell_state_name=payload.bell_state,
            force_measurement_bits=payload.force_measurement_bits
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/measure")
def run_measurement(payload: MeasureRequest):
    """Perform projective measurements across Z, X, or Y basis with configurable shots and noise."""
    try:
        state = get_pauli_eigenstate(payload.quantum_state)
        res = sample_projective_measurements(
            state=state,
            basis=payload.basis,
            shots=payload.shots,
            noise_rate=payload.noise_rate
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
