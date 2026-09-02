import hashlib
import secrets
import time
from typing import Tuple

def generate_nonce(length: int = 16) -> str:
    """Generate a cryptographically secure random hexadecimal nonce."""
    return secrets.token_hex(length)

def compute_sha256(message: str) -> str:
    """
    Computes standard SHA-256 digest of classical message.
    Note: SHA-256 serves as classical message integrity digest, NOT the quantum signature.
    """
    return hashlib.sha256(message.encode("utf-8")).hexdigest()

def generate_signature_id() -> str:
    """Generate a unique signature identifier with prefix."""
    return f"SIG-{secrets.token_hex(6).upper()}"

def generate_session_id() -> str:
    """Generate a unique verification session identifier."""
    return f"VREF-{secrets.token_hex(6).upper()}"

def generate_attack_id() -> str:
    """Generate a unique attack simulation identifier."""
    return f"ATK-{secrets.token_hex(6).upper()}"

def generate_alert_id() -> str:
    """Generate a unique security alert identifier."""
    return f"ALT-{secrets.token_hex(6).upper()}"
