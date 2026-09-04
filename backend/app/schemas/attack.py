from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict

class AttackSimulateRequest(BaseModel):
    attack_type: str = Field(..., description="SIGNATURE_FORGERY, IMPERSONATION, REPLAY_ATTACK, CHANNEL_MANIPULATION, UNAUTHORIZED_VERIFICATION, MESSAGE_TAMPERING, INTERCEPT_RESEND")
    signature_id: Optional[str] = Field(default=None, description="Target signature ID (or auto-picks recent)")
    noise_level: float = Field(default=0.25, ge=0.0, le=1.0, description="Noise parameter for channel manipulation")
    forged_signer: Optional[str] = Field(default="Eve-Impersonator", description="Impersonated signer identity")
    shots: int = Field(default=1000, ge=100, le=10000)

class AttackResponse(BaseModel):
    id: int
    attack_id: str
    signature_id: str
    attack_type: str
    parameters: Optional[str]
    measurement_error: float
    detected: int
    severity: str
    reason: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AttackDetailResponse(AttackResponse):
    verification_session: Optional[Dict[str, Any]] = None
    alert_generated: Optional[Dict[str, Any]] = None
    comparison: Optional[Dict[str, Any]] = None
