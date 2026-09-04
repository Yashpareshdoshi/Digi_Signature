from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    parameters = Column(Text, nullable=False) # JSON configuration
    total_trials = Column(Integer, default=0, nullable=False)
    mean_error_rate = Column(Float, default=0.0, nullable=False)
    false_positive_rate = Column(Float, default=0.0, nullable=False)
    false_negative_rate = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    trials = relationship("ExperimentTrial", back_populates="experiment", cascade="all, delete-orphan")


class ExperimentTrial(Base):
    __tablename__ = "experiment_trials"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(String(32), ForeignKey("experiments.experiment_id"), nullable=False)
    trial_number = Column(Integer, nullable=False)
    quantum_state = Column(String(16), nullable=False)
    measurement_basis = Column(String(8), nullable=False)
    shots = Column(Integer, nullable=False)
    noise_rate = Column(Float, default=0.0, nullable=False)
    is_attack = Column(Boolean, default=False, nullable=False)
    error_rate = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    decision = Column(String(32), nullable=False) # VERIFIED, SUSPICIOUS, REJECTED
    threat_detected = Column(String(64), default="NONE", nullable=False)
    latency_ms = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    experiment = relationship("Experiment", back_populates="trials")
