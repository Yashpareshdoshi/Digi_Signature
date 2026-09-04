from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.attack import Attack
from app.schemas.attack import AttackSimulateRequest, AttackResponse, AttackDetailResponse
from app.services.attack_service import AttackService
from app.core.auth import require_roles

router = APIRouter(prefix="/attacks", tags=["Attacks"])

@router.post("/simulate", response_model=AttackDetailResponse, dependencies=[Depends(require_roles(["Admin", "Verifier"]))])
def simulate_attack(payload: AttackSimulateRequest, db: Session = Depends(get_db)):
    """Simulate a cyber attack against a quantum digital signature and evaluate threat response."""
    try:
        res = AttackService.simulate_attack(
            db=db,
            attack_type=payload.attack_type,
            signature_id=payload.signature_id,
            noise_level=payload.noise_level,
            forged_signer=payload.forged_signer,
            shots=payload.shots
        )
        atk = res["attack"]
        v_sess = res["verification_session"]
        alert = res.get("alert")
        
        return AttackDetailResponse(
            id=atk.id,
            attack_id=atk.attack_id,
            signature_id=atk.signature_id,
            attack_type=atk.attack_type,
            parameters=atk.parameters,
            measurement_error=atk.measurement_error,
            detected=atk.detected,
            severity=atk.severity,
            reason=atk.reason,
            created_at=atk.created_at,
            verification_session={
                "session_id": v_sess.session_id,
                "decision": v_sess.decision,
                "threat_detected": v_sess.threat_detected,
                "error_rate": v_sess.error_rate,
                "forgery_probability": v_sess.forgery_probability,
                "confidence_lower": v_sess.confidence_lower,
                "confidence_upper": v_sess.confidence_upper,
            },
            alert_generated={
                "alert_id": alert.alert_id,
                "severity": alert.severity,
                "title": alert.title,
                "status": alert.status
            } if alert else None,
            comparison={
                "attack_type": atk.attack_type,
                "error_rate_pct": round(atk.measurement_error * 100.0, 2),
                "detected": bool(atk.detected),
                "severity": atk.severity,
                "decision": v_sess.decision
            }
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[AttackResponse])
def list_attacks(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List attack simulation records."""
    return db.query(Attack).order_by(Attack.id.desc()).offset(skip).limit(limit).all()

@router.get("/{attack_id}", response_model=AttackResponse)
def get_attack(attack_id: str, db: Session = Depends(get_db)):
    """Get attack details by ID."""
    atk = db.query(Attack).filter(Attack.attack_id == attack_id).first()
    if not atk:
        raise HTTPException(status_code=404, detail="Attack record not found")
    return atk
