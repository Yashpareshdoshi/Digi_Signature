from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(32), unique=True, index=True, nullable=False)
    attack_id = Column(String(32), ForeignKey("attacks.attack_id"), nullable=True)
    signature_id = Column(String(32), nullable=True)
    severity = Column(String(16), default="HIGH", nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    threat_type = Column(String(64), nullable=False)
    status = Column(String(32), default="ACTIVE", nullable=False) # ACTIVE, INVESTIGATING, RESOLVED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    attack = relationship("Attack", back_populates="alerts")
