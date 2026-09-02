from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    action = Column(String(64), nullable=False) # CREATE_SIGNATURE, TELEPORT, MEASURE, VERIFY, ATTACK_SIMULATE, SETTING_UPDATE
    resource = Column(String(64), nullable=False)
    resource_id = Column(String(64), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
