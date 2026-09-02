from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertPatchRequest
from app.services.audit_service import AuditService

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    status: Optional[str] = Query(None, description="Filter by status (ACTIVE, RESOLVED, etc.)"),
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, etc.)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve filtered list of security alerts."""
    q = db.query(Alert)
    if status and status.upper() != "ALL":
        q = q.filter(Alert.status == status.upper())
    if severity and severity.upper() != "ALL":
        q = q.filter(Alert.severity == severity.upper())
    return q.order_by(Alert.id.desc()).offset(skip).limit(limit).all()

@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    """Get single alert by ID."""
    alt = db.query(Alert).filter(Alert.alert_id == alert_id).first()
    if not alt:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alt

@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert_status(alert_id: str, payload: AlertPatchRequest, db: Session = Depends(get_db)):
    """Update alert status (e.g. mark RESOLVED or INVESTIGATING)."""
    alt = db.query(Alert).filter(Alert.alert_id == alert_id).first()
    if not alt:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    old_status = alt.status
    alt.status = payload.status.upper()
    db.commit()
    db.refresh(alt)

    AuditService.log_event(
        db=db,
        user_id="Security-Operator",
        action="UPDATE_ALERT_STATUS",
        resource="alerts",
        resource_id=alert_id,
        details={"old_status": old_status, "new_status": alt.status}
    )
    return alt
