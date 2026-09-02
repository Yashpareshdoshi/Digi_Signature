from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.signature import Signature
from app.models.verification import VerificationSession
from app.models.attack import Attack
from app.models.alert import Alert
from app.models.measurement import Measurement
from app.schemas.alert import DashboardSummaryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Computes high-level security metrics across signatures, verifications, attacks, and alerts."""
    total_signatures = db.query(Signature).count()
    verified_signatures = db.query(Signature).filter(Signature.status == "VERIFIED").count()
    rejected_signatures = db.query(Signature).filter(Signature.status == "REJECTED").count()
    suspicious_signatures = db.query(Signature).filter(Signature.status == "SUSPICIOUS").count()
    active_alerts = db.query(Alert).filter(Alert.status == "ACTIVE").count()

    total_attacks = db.query(Attack).count()
    attacks_detected = db.query(Attack).filter(Attack.detected == 1).count()
    detection_rate_pct = (float(attacks_detected) / float(total_attacks) * 100.0) if total_attacks > 0 else 100.0

    avg_err = db.query(func.avg(VerificationSession.error_rate)).scalar() or 0.0
    avg_forge = db.query(func.avg(VerificationSession.forgery_probability)).scalar() or 0.0

    recent_verifs = db.query(VerificationSession).order_by(VerificationSession.id.desc()).limit(5).all()
    recent_alerts = db.query(Alert).order_by(Alert.id.desc()).limit(5).all()

    return DashboardSummaryResponse(
        total_signatures=total_signatures,
        verified_signatures=verified_signatures,
        rejected_signatures=rejected_signatures,
        suspicious_signatures=suspicious_signatures,
        active_alerts=active_alerts,
        total_attacks_simulated=total_attacks,
        attacks_detected=attacks_detected,
        detection_rate_pct=round(detection_rate_pct, 2),
        average_measurement_error_pct=round(float(avg_err) * 100.0, 2),
        average_forgery_probability_pct=round(float(avg_forge) * 100.0, 2),
        recent_verifications=[
            {
                "session_id": v.session_id,
                "signature_id": v.signature_id,
                "decision": v.decision,
                "threat_detected": v.threat_detected,
                "error_rate_pct": round(v.error_rate * 100.0, 2),
                "created_at": v.created_at.isoformat()
            } for v in recent_verifs
        ],
        recent_alerts=[
            {
                "alert_id": a.alert_id,
                "title": a.title,
                "severity": a.severity,
                "status": a.status,
                "created_at": a.created_at.isoformat()
            } for a in recent_alerts
        ]
    )

@router.get("/threat-distribution")
def get_threat_distribution(db: Session = Depends(get_db)):
    """Counts verification decisions and threat classifications."""
    threat_counts = db.query(
        VerificationSession.threat_detected,
        func.count(VerificationSession.id)
    ).group_by(VerificationSession.threat_detected).all()

    decision_counts = db.query(
        VerificationSession.decision,
        func.count(VerificationSession.id)
    ).group_by(VerificationSession.decision).all()

    return {
        "threats": [{"name": t[0], "count": t[1]} for t in threat_counts],
        "decisions": [{"name": d[0], "count": d[1]} for d in decision_counts]
    }

@router.get("/timeline")
def get_error_timeline(limit: int = 20, db: Session = Depends(get_db)):
    """Returns chronological series of measurement error rates and confidence bounds."""
    sessions = db.query(VerificationSession).order_by(VerificationSession.id.desc()).limit(limit).all()
    sessions.reverse()
    return [
        {
            "session_id": s.session_id,
            "signature_id": s.signature_id,
            "error_rate_pct": round(s.error_rate * 100.0, 2),
            "ci_lower_pct": round(s.confidence_lower * 100.0, 2),
            "ci_upper_pct": round(s.confidence_upper * 100.0, 2),
            "decision": s.decision,
            "timestamp": s.created_at.strftime("%H:%M:%S")
        }
        for s in sessions
    ]

@router.get("/measurement-distribution")
def get_measurement_distribution(db: Session = Depends(get_db)):
    """Aggregates outcome matches and mismatches across Z, X, and Y measurement bases."""
    basis_stats = db.query(
        Measurement.basis,
        Measurement.is_match,
        func.count(Measurement.id)
    ).group_by(Measurement.basis, Measurement.is_match).all()

    data = {"Z": {"match": 0, "mismatch": 0}, "X": {"match": 0, "mismatch": 0}, "Y": {"match": 0, "mismatch": 0}}
    for b, is_m, cnt in basis_stats:
        if b in data:
            if is_m == 1:
                data[b]["match"] += cnt
            else:
                data[b]["mismatch"] += cnt

    return [{"basis": k, "matches": v["match"], "mismatches": v["mismatch"]} for k, v in data.items()]
