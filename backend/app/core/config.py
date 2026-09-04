import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Quantum-Inspired Cyber Threat Detection for Digital Signature Security"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./qds_database.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Statistical / Verification Thresholds (Defaults)
    DEFAULT_SHOTS: int = 1000
    LOW_ERROR_THRESHOLD: float = 0.05       # <= 5% -> Verified
    HIGH_ERROR_THRESHOLD: float = 0.15      # > 15% -> Rejected; 5-15% -> Suspicious
    CONFIDENCE_LEVEL: float = 0.95          # 95% Wilson Score CI
    EXPECTED_LEGITIMATE_ERROR: float = 0.02 # Baseline noise in quantum simulation
    REPLAY_WINDOW_SECONDS: int = 3600       # 1 hour validity window for nonces
    
    DEFAULT_BELL_STATE: str = "Phi+"
    DEFAULT_MEASUREMENT_BASIS: str = "Z"
    QUANTUM_BACKEND: str = "numpy" # 'numpy' (default reference) or 'qiskit' (standard SDK)

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
