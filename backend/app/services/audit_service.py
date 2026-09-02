import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        user_id: str,
        action: str,
        resource: str,
        resource_id: str = None,
        details: dict = None
    ) -> AuditLog:
        """Records an immutable security audit event."""
        details_str = json.dumps(details) if isinstance(details, dict) else str(details or "")
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details_str,
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
