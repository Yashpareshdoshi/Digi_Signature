from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.setting import SystemSetting
from app.schemas.alert import SettingUpdateRequest, SettingResponse
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULT_SETTINGS = [
    {"key": "LOW_ERROR_THRESHOLD", "value": str(settings.LOW_ERROR_THRESHOLD), "description": "Verification low threshold (E <= T_low -> VERIFIED)"},
    {"key": "HIGH_ERROR_THRESHOLD", "value": str(settings.HIGH_ERROR_THRESHOLD), "description": "Rejection high threshold (E > T_high -> REJECTED)"},
    {"key": "DEFAULT_SHOTS", "value": str(settings.DEFAULT_SHOTS), "description": "Default projective measurement shot count"},
    {"key": "CONFIDENCE_LEVEL", "value": str(settings.CONFIDENCE_LEVEL), "description": "Wilson score confidence level (0.95 = 95%)"},
    {"key": "EXPECTED_LEGITIMATE_ERROR", "value": str(settings.EXPECTED_LEGITIMATE_ERROR), "description": "Baseline quantum channel noise assumption"},
    {"key": "REPLAY_WINDOW_SECONDS", "value": str(settings.REPLAY_WINDOW_SECONDS), "description": "Validity time window for cryptographic nonces in seconds"},
    {"key": "DEFAULT_BELL_STATE", "value": settings.DEFAULT_BELL_STATE, "description": "Default Bell state used for EPR pair generation"},
    {"key": "DEFAULT_MEASUREMENT_BASIS", "value": settings.DEFAULT_MEASUREMENT_BASIS, "description": "Default measurement basis (Z, X, Y)"},
]

@router.get("", response_model=List[SettingResponse])
def get_settings(db: Session = Depends(get_db)):
    """Retrieve all dynamic system configuration parameters."""
    items = db.query(SystemSetting).all()
    if not items:
        # Initialize default settings
        for s in DEFAULT_SETTINGS:
            setting_obj = SystemSetting(key=s["key"], value=s["value"], description=s["description"])
            db.add(setting_obj)
        db.commit()
        items = db.query(SystemSetting).all()
    return items

@router.put("/{key}", response_model=SettingResponse)
def update_setting(key: str, payload: SettingUpdateRequest, db: Session = Depends(get_db)):
    """Update a specific configuration parameter with validation."""
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if not setting:
        setting = SystemSetting(key=key, value=payload.value, description=payload.description)
        db.add(setting)
    else:
        # Validate values
        try:
            if key in ("LOW_ERROR_THRESHOLD", "HIGH_ERROR_THRESHOLD", "CONFIDENCE_LEVEL", "EXPECTED_LEGITIMATE_ERROR"):
                val = float(payload.value)
                if not (0.0 <= val <= 1.0):
                    raise ValueError(f"Value for {key} must be between 0.0 and 1.0")
            elif key in ("DEFAULT_SHOTS", "REPLAY_WINDOW_SECONDS"):
                val = int(payload.value)
                if val <= 0:
                    raise ValueError(f"Value for {key} must be a positive integer")
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))

        setting.value = payload.value
        if payload.description:
            setting.description = payload.description

    db.commit()
    db.refresh(setting)
    return setting

@router.post("/reset", response_model=List[SettingResponse])
def reset_settings(db: Session = Depends(get_db)):
    """Reset all configuration parameters to system defaults."""
    db.query(SystemSetting).delete()
    for s in DEFAULT_SETTINGS:
        setting_obj = SystemSetting(key=s["key"], value=s["value"], description=s["description"])
        db.add(setting_obj)
    db.commit()
    return db.query(SystemSetting).all()
