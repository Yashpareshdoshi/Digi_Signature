from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class VerificationSession(Base):
    __tablename__ = "verification_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(32), unique=True, index=True, nullable=False)
    signature_id = Column(String(32), ForeignKey("signatures.signature_id"), nullable=False)
    verifier_id = Column(String(64), nullable=False)
    signer_id = Column(String(64), nullable=False)
    measurement_count = Column(Integer, nullable=False)
    error_count = Column(Integer, nullable=False)
    error_rate = Column(Float, nullable=False)
    forgery_probability = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    decision = Column(String(32), nullable=False) # VERIFIED, SUSPICIOUS, REJECTED
    threat_detected = Column(String(64), default="NONE", nullable=False) # NONE, FORGERY, REPLAY, IMPERSONATION, CHANNEL_MANIPULATION, UNAUTHORIZED
    reason = Column(Text, nullable=False)
    latency_ms = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    signature = relationship("Signature", back_populates="verifications")
