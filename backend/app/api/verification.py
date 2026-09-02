from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.verification import VerificationSession
from app.schemas.verification import VerificationStartRequest, VerificationResponse, VerificationDetailResponse
from app.services.verification_service import VerificationService

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.post("/start", response_model=VerificationDetailResponse)
def start_verification(payload: VerificationStartRequest, db: Session = Depends(get_db)):
    """Execute signature verification with statistical analysis and deterministic threat detection."""
    try:
        res = VerificationService.verify_signature(
            db=db,
            signature_id=payload.signature_id,
            verifier_id=payload.verifier_id,
            claimed_signer_id=payload.claimed_signer_id,
            custom_message=payload.custom_message,
            shots=payload.shots,
            noise_rate=payload.noise_rate,
            simulate_nonce_reuse=payload.simulate_nonce_reuse,
            low_threshold=payload.low_threshold,
            high_threshold=payload.high_threshold
        )
        s = res["session"]
        return VerificationDetailResponse(
            id=s.id,
            session_id=s.session_id,
            signature_id=s.signature_id,
            verifier_id=s.verifier_id,
            signer_id=s.signer_id,
            measurement_count=s.measurement_count,
            error_count=s.error_count,
            error_rate=s.error_rate,
            forgery_probability=s.forgery_probability,
            confidence_lower=s.confidence_lower,
            confidence_upper=s.confidence_upper,
            decision=s.decision,
            threat_detected=s.threat_detected,
            reason=s.reason,
            latency_ms=s.latency_ms,
            created_at=s.created_at,
            statistical_details=res["statistical_details"],
            rule_details=res["rule_details"],
            measurement_counts=res["measurement_counts"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[VerificationResponse])
def list_verifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List recent verification sessions."""
    return db.query(VerificationSession).order_by(VerificationSession.id.desc()).offset(skip).limit(limit).all()

@router.get("/{session_id}", response_model=VerificationResponse)
def get_verification(session_id: str, db: Session = Depends(get_db)):
    """Retrieve specific verification session by ID."""
    s = db.query(VerificationSession).filter(VerificationSession.session_id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Verification session not found")
    return s
