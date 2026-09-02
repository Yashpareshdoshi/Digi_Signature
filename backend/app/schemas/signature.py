from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class SignatureCreateRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message to be signed")
    signer_id: str = Field(default="Signer-Alice", description="Identity of the signer")
    bell_state: str = Field(default="Phi+", description="Bell state used for teleportation (Phi+, Phi-, Psi+, Psi-)")
    quantum_state: str = Field(default="|0>", description="Pauli eigenstate to encode (|0>, |1>, |+>, |->, |+i>, |-i>)")
    measurement_basis: str = Field(default="Z", description="Measurement basis (Z, X, Y)")
    shots: int = Field(default=1000, ge=100, le=10000, description="Measurement shot count")

class SignatureResponse(BaseModel):
    id: int
    signature_id: str
    message: str
    message_hash: str
    signer_id: str
    bell_state: str
    quantum_state: str
    nonce: str
    nonce_consumed: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SignatureDetailResponse(SignatureResponse):
    teleportation_data: Optional[Dict[str, Any]] = None
    measurement_summary: Optional[Dict[str, Any]] = None
