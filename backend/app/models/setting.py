from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.database import Base

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(64), unique=True, index=True, nullable=False)
    value = Column(String(256), nullable=False)
    description = Column(String(256), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
