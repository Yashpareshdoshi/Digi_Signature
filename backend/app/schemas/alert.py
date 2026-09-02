from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class AlertResponse(BaseModel):
    id: int
    alert_id: str
    attack_id: Optional[str]
    signature_id: Optional[str]
    severity: str
    title: str
    description: str
    threat_type: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AlertPatchRequest(BaseModel):
    status: str = Field(..., description="ACTIVE, INVESTIGATING, RESOLVED, DISMISSED")

class SettingUpdateRequest(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingResponse(BaseModel):
    key: str
    value: str
    description: Optional[str]
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardSummaryResponse(BaseModel):
    total_signatures: int
    verified_signatures: int
    rejected_signatures: int
    suspicious_signatures: int
    active_alerts: int
    total_attacks_simulated: int
    attacks_detected: int
    detection_rate_pct: float
    average_measurement_error_pct: float
    average_forgery_probability_pct: float
    recent_verifications: List[Dict[str, Any]]
    recent_alerts: List[Dict[str, Any]]
