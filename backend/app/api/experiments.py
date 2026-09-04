from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.experiment import Experiment
from app.schemas.experiment import ExperimentRunRequest, ExperimentResponse
from app.services.experiment_service import ExperimentService

router = APIRouter(prefix="/experiments", tags=["Experiments"])

@router.post("/run", response_model=ExperimentResponse)
def run_experiment_sweep(payload: ExperimentRunRequest, db: Session = Depends(get_db)):
    """Run an automated batch parameter sweep across quantum states, bases, and noise levels."""
    try:
        exp = ExperimentService.run_sweep(
            db=db,
            name=payload.name,
            description=payload.description or "Automated sweep",
            states=payload.states,
            bases=payload.bases,
            shots_list=payload.shots_list,
            noise_levels=payload.noise_levels,
            trials_per_config=payload.trials_per_config,
            backend_name=payload.backend_name or "numpy",
            attack_scenario=payload.attack_scenario or "LEGITIMATE"
        )
        return exp
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Experiment execution failed: {str(e)}")

@router.get("", response_model=List[ExperimentResponse])
def list_experiments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """List historical experiment benchmark runs."""
    return db.query(Experiment).order_by(Experiment.id.desc()).offset(skip).limit(limit).all()

@router.get("/{experiment_id}", response_model=ExperimentResponse)
def get_experiment_details(experiment_id: str, db: Session = Depends(get_db)):
    """Get full details and individual trials of a specific experiment run."""
    exp = db.query(Experiment).filter(Experiment.experiment_id == experiment_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return exp
