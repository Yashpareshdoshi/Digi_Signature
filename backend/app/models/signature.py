from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    signature_id = Column(String(32), unique=True, index=True, nullable=False)
    message = Column(Text, nullable=False)
    message_hash = Column(String(64), nullable=False) # Classical SHA-256 integrity hash
    signer_id = Column(String(64), nullable=False)    # e.g., "Signer-Alice"
    bell_state = Column(String(16), default="Phi+", nullable=False) # Phi+, Phi-, Psi+, Psi-
    quantum_state = Column(String(16), default="|0>", nullable=False) # |0>, |1>, |+>, |->, |+i>, |-i>
    nonce = Column(String(64), unique=True, index=True, nullable=False)
    nonce_consumed = Column(Integer, default=0, nullable=False) # 1 if used in verification
    status = Column(String(32), default="GENERATED", nullable=False) # GENERATED, VERIFIED, SUSPICIOUS, REJECTED, ATTACKED
    teleport_bits = Column(String(8), nullable=True) # e.g. "00", "01", "10", "11"
    pauli_correction = Column(String(16), nullable=True) # e.g. "I", "X", "Z", "ZX (or -iY)"
    teleport_fidelity = Column(Float, default=1.0, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    measurements = relationship("Measurement", back_populates="signature", cascade="all, delete-orphan")
    verifications = relationship("VerificationSession", back_populates="signature", cascade="all, delete-orphan")
    attacks = relationship("Attack", back_populates="signature", cascade="all, delete-orphan")
