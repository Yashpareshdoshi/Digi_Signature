import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.database import engine, Base, init_and_upgrade_db
from app.database.seed import seed_database
from app.api import signatures, quantum, verification, attacks, alerts, dashboard, settings as settings_api, analytics, demo, audit, experiments

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("QDS-Security-Engine")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing & Upgrading Quantum Digital Signature Database...")
    init_and_upgrade_db()
    try:
        seed_database()
    except Exception as e:
        logger.warning(f"Seed execution note: {e}")
    logger.info("QDS Threat Detection Engine Online.")
    yield
    logger.info("Shutting down QDS Threat Detection Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# Quantum-Inspired Cyber Threat Detection for Digital Signature Security
### Deterministic, Statistical & Protocol-Aware Threat Detection for Teleportation-Based QDS

**Academic Research Prototype**:
- Software-based simulation of Bell states, 3-qubit teleportation, Pauli corrections, and projective measurements.
- **NO AI/Machine Learning**: Strictly deterministic statistical tests, Wilson score intervals, and protocol rules.
- Real-time simulation of Forgery, Replay, Impersonation, and Channel Manipulation attacks.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development and demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred in the quantum simulation engine.", "error": str(exc)}
    )

# Health Check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Quantum Digital Signature Threat Detection Engine",
        "version": "1.0.0",
        "simulation_mode": "NumPy Quantum Statevector Simulator",
        "ai_ml_models": "DISABLED (Purely Deterministic / Statistical)"
    }

# Register API Routers
app.include_router(signatures.router, prefix=settings.API_V1_STR)
app.include_router(quantum.router, prefix=settings.API_V1_STR)
app.include_router(verification.router, prefix=settings.API_V1_STR)
app.include_router(attacks.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(settings_api.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(experiments.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
