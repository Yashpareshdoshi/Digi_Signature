from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.audit import AuditLog

router = APIRouter(tags=["Audit Logs"])

@router.get("/audit", tags=["Audit Logs"])
@router.get("/audit-logs", tags=["Audit Logs"])
def list_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action"),
    user_id: Optional[str] = Query(None, description="Filter by user"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieve security audit trail with optional filtering."""
    q = db.query(AuditLog)
    if action and action != "ALL":
        q = q.filter(AuditLog.action == action)
    if user_id and user_id != "ALL":
        q = q.filter(AuditLog.user_id == user_id)
    return q.order_by(AuditLog.id.desc()).offset(skip).limit(limit).all()
