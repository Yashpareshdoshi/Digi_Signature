from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.demo_service import DemoService

router = APIRouter(prefix="/demo", tags=["Demo Workflow"])

@router.post("/run-complete")
def run_complete_demo(
    message: str = Query("Transfer ₹5000 to Account X", description="Message to sign and verify"),
    bell_state: str = Query("Phi+", description="Bell state (Phi+, Phi-, Psi+, Psi-)"),
    quantum_state: str = Query("|0>", description="Pauli eigenstate (|0>, |1>, |+>, |->, |+i>, |-i>)"),
    attack_type: str = Query("SIGNATURE_FORGERY", description="Simulated attack scenario"),
    db: Session = Depends(get_db)
):
    """
    Executes the automated 12-step end-to-end research demo workflow in ~1-2 seconds.
    Populates signatures, verifications, attack logs, deterministic threat decisions, alerts, and metrics.
    """
    return DemoService.run_complete_demo(
        db=db,
        message=message,
        bell_state=bell_state,
        quantum_state=quantum_state,
        attack_type=attack_type
    )
