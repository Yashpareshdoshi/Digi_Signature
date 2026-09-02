from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class Attack(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, index=True)
    attack_id = Column(String(32), unique=True, index=True, nullable=False)
    signature_id = Column(String(32), ForeignKey("signatures.signature_id"), nullable=False)
    attack_type = Column(String(64), nullable=False) # SIGNATURE_FORGERY, IMPERSONATION, REPLAY_ATTACK, CHANNEL_MANIPULATION, UNAUTHORIZED_VERIFICATION
    parameters = Column(Text, nullable=True) # JSON string of attack parameters (noise_level, forged_signer, etc.)
    measurement_error = Column(Float, nullable=False)
    detected = Column(Integer, default=1, nullable=False) # 1 if detected, 0 if bypassed
    severity = Column(String(16), default="HIGH", nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    signature = relationship("Signature", back_populates="attacks")
    alerts = relationship("Alert", back_populates="attack", cascade="all, delete-orphan")
