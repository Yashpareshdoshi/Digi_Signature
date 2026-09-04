import random
from datetime import datetime, timedelta
from app.database.database import SessionLocal, engine, Base, init_and_upgrade_db
from app.models.user import User
from app.models.signature import Signature
from app.models.measurement import Measurement
from app.models.verification import VerificationSession
from app.models.attack import Attack
from app.models.alert import Alert
from app.models.audit import AuditLog
from app.models.setting import SystemSetting
from app.core.config import settings
from app.services.qds_service import QDSService
from app.services.verification_service import VerificationService
from app.services.attack_service import AttackService
from app.api.settings import DEFAULT_SETTINGS

SAMPLE_MESSAGES = [
    "Transfer ₹5000 to Account X",
    "Approve Smart Grid Dispatch Order #8921",
    "Authorize Quantum Key Distribution Channel Sync",
    "Deploy Autonomous Satellite Firmware Patch v4.2",
    "Authorize High-Frequency Trading Block #5532",
    "Verify Defense Telemetry Signature Packet 0x99A",
    "Commit Financial Clearing Record Batch #1024",
    "Authorize Healthcare Patient Record Decryption",
    "Sign SCADA Industrial Control Switch Event #77",
    "Execute Multi-Party Quantum State Agreement #12",
    "Confirm Inter-Bank SWIFT Settlement Token",
    "Authenticate Zero-Trust Edge Node Gateway Session"
]

def seed_database():
    """Populates SQLite database with comprehensive initial data."""
    init_and_upgrade_db()
    db = SessionLocal()

    # 1. Always Ensure Users with Prototype API Keys Exist
    users_data = [
        ("Signer-Alice", "Signer", "SIG-KEY-ALICE-101"),
        ("Signer-Charlie", "Signer", "SIG-KEY-CHARLIE-102"),
        ("Verifier-Bob", "Verifier", "VER-KEY-BOB-202"),
        ("Verifier-Dave", "Verifier", "VER-KEY-DAVE-203"),
        ("Auditor-Eve", "Auditor", "AUD-KEY-EVE-555"),
        ("Admin-Security", "Admin", "ADM-KEY-ROOT-999")
    ]
    for username, role, key in users_data:
        existing_u = db.query(User).filter(User.username == username).first()
        if not existing_u:
            db.add(User(username=username, role=role, api_key=key, is_active=True))
        elif not existing_u.api_key:
            existing_u.api_key = key
    db.commit()

    # 2. Always Ensure System Settings Exist
    for s in DEFAULT_SETTINGS:
        if not db.query(SystemSetting).filter(SystemSetting.key == s["key"]).first():
            db.add(SystemSetting(key=s["key"], value=s["value"], description=s["description"]))
    db.commit()

    # 3. Check if signatures already seeded
    if db.query(Signature).count() >= 5:
        print("Database already contains seed signatures. Skipping signature generation.")
        db.close()
        return

    print("Seeding database with realistic Quantum Digital Signature data...")

    # 4. Create 12 Initial Signatures
    created_sigs = []
    bell_states = ["Phi+", "Phi-", "Psi+", "Psi-"]
    quantum_states = ["|0>", "|1>", "|+>", "|->", "|+i>", "|-i>"]
    
    for i, msg in enumerate(SAMPLE_MESSAGES):
        signer = "Signer-Alice" if i % 2 == 0 else "Signer-Charlie"
        bell = bell_states[i % len(bell_states)]
        q_state = quantum_states[i % len(quantum_states)]
        basis = "Z" if q_state in ("|0>", "|1>") else ("X" if q_state in ("|+>", "|->") else "Y")
        
        res = QDSService.create_signature(
            db=db,
            message=msg,
            signer_id=signer,
            bell_state=bell,
            quantum_state=q_state,
            measurement_basis=basis,
            shots=1000
        )
        created_sigs.append(res["signature"])

    # 4. Generate 20 Legitimate Verifications
    for i in range(20):
        target_sig = created_sigs[i % len(created_sigs)]
        # Low noise (0 - 2%)
        noise = random.uniform(0.0, 0.02)
        VerificationService.verify_signature(
            db=db,
            signature_id=target_sig.signature_id,
            verifier_id="Verifier-Bob" if i % 2 == 0 else "Verifier-Dave",
            shots=1000,
            noise_rate=noise
        )

    # 5. Simulate 12 Attacks (Forgery, Replay, Impersonation, Channel Noise)
    attack_types = [
        ("SIGNATURE_FORGERY", 0.85, "Eve-Impersonator"),
        ("REPLAY_ATTACK", 0.02, "Eve-Replay"),
        ("IMPERSONATION", 0.01, "Attacker-Mallory"),
        ("CHANNEL_MANIPULATION", 0.22, "Eve-Eavesdropper"),
        ("SIGNATURE_FORGERY", 0.90, "Eve-Impersonator"),
        ("CHANNEL_MANIPULATION", 0.28, "Eve-Jammer"),
        ("REPLAY_ATTACK", 0.01, "Eve-Replay"),
        ("IMPERSONATION", 0.01, "Signer-Fake"),
        ("SIGNATURE_FORGERY", 0.80, "Eve-Attacker"),
        ("CHANNEL_MANIPULATION", 0.18, "Noise-Simulator"),
        ("UNAUTHORIZED_VERIFICATION", 0.01, "Unknown-Entity"),
        ("SIGNATURE_FORGERY", 0.75, "Eve-Impersonator")
    ]

    for atk_type, noise_val, forged_entity in attack_types:
        target_sig = random.choice(created_sigs)
        AttackService.simulate_attack(
            db=db,
            attack_type=atk_type,
            signature_id=target_sig.signature_id,
            noise_level=noise_val,
            forged_signer=forged_entity,
            shots=1000
        )

    db.close()
    print("Database seeding successfully finished.")

if __name__ == "__main__":
    seed_database()
