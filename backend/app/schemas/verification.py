import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict, field_validator

class VerificationStartRequest(BaseModel):
    signature_id: str = Field(..., description="ID of the signature to verify")
    verifier_id: str = Field(default="Verifier-Bob", description="Identity of verifying entity")
    claimed_signer_id: Optional[str] = Field(default=None, description="Claimed signer identity (defaults to signature signer)")
    custom_message: Optional[str] = Field(default=None, description="Message to test integrity against")
    shots: int = Field(default=1000, ge=100, le=10000, description="Measurement shots")
    noise_rate: float = Field(default=0.0, ge=0.0, le=1.0, description="Simulated channel noise")
    simulate_nonce_reuse: bool = Field(default=False, description="Simulate replay attack via consumed nonce")
    low_threshold: Optional[float] = Field(default=None, ge=0.01, le=0.50)
    high_threshold: Optional[float] = Field(default=None, ge=0.05, le=0.90)

class VerificationResponse(BaseModel):
    id: int
    session_id: str
    signature_id: str
    verifier_id: str
    signer_id: str
    measurement_count: int
    error_count: int
    error_rate: float
    forgery_probability: float
    confidence_lower: float
    confidence_upper: float
    decision: str
    threat_detected: str
    reason: str
    latency_ms: float
    decision_ledger: Optional[Any] = None
    is_attack: Optional[int] = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("decision_ledger", mode="before")
    @classmethod
    def parse_decision_ledger(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return v
        return v

class VerificationDetailResponse(VerificationResponse):
    statistical_details: Optional[Dict[str, Any]] = None
    rule_details: Optional[Dict[str, Any]] = None
    measurement_counts: Optional[Dict[str, int]] = None
    qds_details: Optional[Dict[str, Any]] = None
