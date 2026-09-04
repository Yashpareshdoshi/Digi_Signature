from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.signature import Signature
from app.schemas.signature import SignatureCreateRequest, SignatureResponse, SignatureDetailResponse
from app.services.qds_service import QDSService
from app.core.auth import require_roles

router = APIRouter(prefix="/signatures", tags=["Signatures"])

@router.post("", response_model=SignatureDetailResponse, dependencies=[Depends(require_roles(["Signer"]))])
def create_signature(payload: SignatureCreateRequest, db: Session = Depends(get_db)):
    """Generate a simulated Quantum Digital Signature."""
    try:
        res = QDSService.create_signature(
            db=db,
            message=payload.message,
            signer_id=payload.signer_id,
            bell_state=payload.bell_state,
            quantum_state=payload.quantum_state,
            measurement_basis=payload.measurement_basis,
            shots=payload.shots
        )
        sig = res["signature"]
        teleport_data = {k: v for k, v in res["teleportation"].items() if k != "recovered_statevector"}
        return SignatureDetailResponse(
            id=sig.id,
            signature_id=sig.signature_id,
            message=sig.message,
            message_hash=sig.message_hash,
            signer_id=sig.signer_id,
            bell_state=sig.bell_state,
            quantum_state=sig.quantum_state,
            nonce=sig.nonce,
            nonce_consumed=sig.nonce_consumed,
            status=sig.status,
            teleport_bits=sig.teleport_bits,
            pauli_correction=sig.pauli_correction,
            teleport_fidelity=sig.teleport_fidelity,
            created_at=sig.created_at,
            teleportation_data=teleport_data,
            measurement_summary=res["measurements"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[SignatureResponse])
def list_signatures(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve list of signatures."""
    return db.query(Signature).order_by(Signature.id.desc()).offset(skip).limit(limit).all()

@router.get("/{signature_id}", response_model=SignatureResponse)
def get_signature(signature_id: str, db: Session = Depends(get_db)):
    """Retrieve a single signature by ID."""
    sig = db.query(Signature).filter(Signature.signature_id == signature_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signature not found")
    return sig
