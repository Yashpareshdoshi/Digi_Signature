import numpy as np
from typing import Dict, Any, List, Tuple
from app.quantum.statevector import Statevector
from app.quantum.pauli import PAULI_STATES

# Projective Measurement Projectors
# Z Basis: P0 = |0><0|, P1 = |1><1|
# X Basis: P+ = |+><+|, P- = |-><-|
# Y Basis: P+i = |+i><+i|, P-i = |-i><-i|

PROJECTORS = {
    "Z": {
        "0": np.outer(PAULI_STATES["|0>"], np.conj(PAULI_STATES["|0>"])),
        "1": np.outer(PAULI_STATES["|1>"], np.conj(PAULI_STATES["|1>"])),
    },
    "X": {
        "+": np.outer(PAULI_STATES["|+>"], np.conj(PAULI_STATES["|+>"])),
        "-": np.outer(PAULI_STATES["|->"], np.conj(PAULI_STATES["|->"])),
    },
    "Y": {
        "+i": np.outer(PAULI_STATES["|+i>"], np.conj(PAULI_STATES["|+i>"])),
        "-i": np.outer(PAULI_STATES["|-i>"], np.conj(PAULI_STATES["|-i>"])),
    }
}

def calculate_projective_probabilities(state: Statevector, basis: str = "Z") -> Dict[str, float]:
    """
    Computes exact Born-rule probabilities for a 1-qubit state:
    p_k = <psi| P_k |psi>
    """
    basis = basis.upper()
    if basis not in PROJECTORS:
        raise ValueError(f"Unsupported measurement basis: '{basis}'. Must be 'Z', 'X', or 'Y'.")
    
    probs = {}
    total_prob = 0.0
    for outcome, proj in PROJECTORS[basis].items():
        # <psi | proj | psi> = trace(proj * |psi><psi|)
        p = float(np.real(np.vdot(state.data, proj @ state.data)))
        p = max(0.0, min(1.0, p)) # Clip to [0, 1]
        probs[outcome] = p
        total_prob += p
    
    # Normalize probabilities to ensure sum == 1.0
    if total_prob > 0:
        probs = {k: v / total_prob for k, v in probs.items()}
    
    return probs

def get_expected_outcome(state_label: str, basis: str) -> str:
    """Determines the expected deterministic measurement outcome if measuring in the eigenbasis."""
    state_label = state_label.strip()
    basis = basis.upper()
    
    if basis == "Z":
        if state_label in ("|0>", "0"):
            return "0"
        elif state_label in ("|1>", "1"):
            return "1"
        else:
            return "0" # Default primary
    elif basis == "X":
        if state_label in ("|+>", "+"):
            return "+"
        elif state_label in ("|->", "-"):
            return "-"
        else:
            return "+"
    elif basis == "Y":
        if state_label in ("|+i>", "+i"):
            return "+i"
        elif state_label in ("|-i>", "-i"):
            return "-i"
        else:
            return "+i"
    return "0"

def sample_projective_measurements(
    state: Statevector,
    basis: str = "Z",
    shots: int = 1000,
    expected_outcome: str = None,
    noise_rate: float = 0.0,
    seed: int = None
) -> Dict[str, Any]:
    """
    Performs projective measurements for a specified number of shots (e.g. 100, 500, 1000, 5000, 10000).
    Incorporates optional simulated channel/measurement noise.
    """
    if seed is not None:
        np.random.seed(seed)
        
    basis = basis.upper()
    probs = calculate_projective_probabilities(state, basis)
    
    outcomes = list(probs.keys())
    prob_weights = [probs[o] for o in outcomes]
    
    # Apply noise to probability distribution if present (e.g. depolarizing channel effect)
    if noise_rate > 0.0:
        uniform_p = 1.0 / len(outcomes)
        prob_weights = [(1.0 - noise_rate) * p + noise_rate * uniform_p for p in prob_weights]
        p_sum = sum(prob_weights)
        prob_weights = [p / p_sum for p in prob_weights]
    
    # Monte Carlo sampling
    samples = np.random.choice(outcomes, size=shots, p=prob_weights)
    counts = {o: int(np.sum(samples == o)) for o in outcomes}
    
    # If no expected outcome provided, use outcome with highest theoretical probability
    if expected_outcome is None:
        expected_outcome = max(probs, key=probs.get)
    
    expected_count = counts.get(expected_outcome, 0)
    unexpected_count = shots - expected_count
    empirical_error_rate = unexpected_count / float(shots)
    
    # Generate sample records (up to 50 sample shots for inspection)
    sample_records = []
    for idx, outcome in enumerate(samples[:50]):
        is_match = (outcome == expected_outcome)
        sample_records.append({
            "shot_number": idx + 1,
            "basis": basis,
            "expected_outcome": expected_outcome,
            "actual_outcome": str(outcome),
            "probability": float(probs.get(outcome, 0.0)),
            "is_match": 1 if is_match else 0
        })
    
    return {
        "basis": basis,
        "shots": shots,
        "theoretical_probabilities": probs,
        "counts": counts,
        "expected_outcome": expected_outcome,
        "expected_count": expected_count,
        "unexpected_count": unexpected_count,
        "empirical_error_rate": float(empirical_error_rate),
        "empirical_accuracy": float(expected_count / float(shots)),
        "noise_applied": float(noise_rate),
        "sample_records": sample_records
    }
