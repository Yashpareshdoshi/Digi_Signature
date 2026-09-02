from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    role = Column(String(32), default="Signer", nullable=False) # Signer, Verifier, Auditor, Admin
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
