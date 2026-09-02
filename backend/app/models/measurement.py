from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    signature_id = Column(String(32), ForeignKey("signatures.signature_id"), nullable=False)
    basis = Column(String(8), nullable=False) # Z, X, Y
    expected_outcome = Column(String(16), nullable=False)
    actual_outcome = Column(String(16), nullable=False)
    probability = Column(Float, nullable=False)
    shot_number = Column(Integer, nullable=False)
    is_match = Column(Integer, default=1, nullable=False) # 1 if match, 0 if unexpected outcome
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    signature = relationship("Signature", back_populates="measurements")
