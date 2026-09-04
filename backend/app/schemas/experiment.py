from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class ExperimentRunRequest(BaseModel):
    name: str = Field(default="Academic Quantum Benchmark", description="Title of experiment")
    description: Optional[str] = Field(default="Parameter sweep across quantum states and noise levels")
    states: List[str] = Field(default=["|0>", "|+>"], description="Pauli eigenstates to evaluate")
    bases: List[str] = Field(default=["Z", "X"], description="Measurement bases to test")
    shots_list: List[int] = Field(default=[500, 1000], description="Shot counts")
    noise_levels: List[float] = Field(default=[0.0, 0.05, 0.20], description="Physical channel noise levels")
    trials_per_config: int = Field(default=2, ge=1, le=10, description="Trials per combination")
    backend_name: Optional[str] = Field(default="numpy", description="'numpy' or 'qiskit'")
    attack_scenario: Optional[str] = Field(default="LEGITIMATE", description="Attack scenario: 'LEGITIMATE', 'SIGNATURE_FORGERY', 'CHANNEL_MANIPULATION', 'INTERCEPT_RESEND'")

class ExperimentTrialResponse(BaseModel):
    trial_number: int
    quantum_state: str
    measurement_basis: str
    shots: int
    noise_rate: float
    is_attack: bool
    error_rate: float
    confidence_lower: float
    confidence_upper: float
    decision: str
    threat_detected: str
    latency_ms: float

    model_config = ConfigDict(from_attributes=True)

class ExperimentResponse(BaseModel):
    id: int
    experiment_id: str
    name: str
    description: Optional[str]
    total_trials: int
    mean_error_rate: float
    false_positive_rate: float
    false_negative_rate: float
    created_at: datetime
    trials: Optional[List[ExperimentTrialResponse]] = None

    model_config = ConfigDict(from_attributes=True)
