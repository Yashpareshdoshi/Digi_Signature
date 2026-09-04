from typing import Optional
from app.quantum.backend import QuantumBackend
from app.quantum.numpy_backend import NumpyBackend

_backend_instances = {}

def get_quantum_backend(name: Optional[str] = None) -> QuantumBackend:
    """
    Factory function resolving quantum simulation backend instance by name.
    Supports 'numpy' and 'qiskit'.
    Strictly raises an error if the requested backend is unavailable or fails to initialize.
    No silent fallback.
    """
    from app.core.config import settings
    selected_name = (name or getattr(settings, "QUANTUM_BACKEND", "numpy")).lower().strip()

    if selected_name not in _backend_instances:
        if selected_name == "qiskit":
            try:
                from app.quantum.qiskit_backend import QiskitBackend
                _backend_instances["qiskit"] = QiskitBackend()
            except Exception as e:
                raise RuntimeError(
                    f"Requested quantum backend 'qiskit' could not be initialized: {e}. "
                    "Please ensure qiskit and qiskit-aer are installed."
                ) from e
        elif selected_name == "numpy":
            _backend_instances["numpy"] = NumpyBackend()
        else:
            raise ValueError(f"Unknown quantum backend '{selected_name}'. Must be 'qiskit' or 'numpy'.")

    return _backend_instances[selected_name]
