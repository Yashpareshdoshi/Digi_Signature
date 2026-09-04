from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from sqlalchemy import inspect, text

def init_and_upgrade_db():
    """
    Initializes database tables and safely upgrades SQLite schema
    if columns were added to existing ORM models.
    Ensures a fresh clone or existing database initializes without manual deletion.
    """
    # Import all models to ensure metadata has registered all tables
    import app.models # noqa
    Base.metadata.create_all(bind=engine)

    if "sqlite" in settings.DATABASE_URL:
        with engine.begin() as conn:
            inspector = inspect(conn)
            
            # Upgrade signatures table if missing new teleportation fields
            if "signatures" in inspector.get_table_names():
                cols = [c["name"] for c in inspector.get_columns("signatures")]
                if "teleport_bits" not in cols:
                    conn.execute(text("ALTER TABLE signatures ADD COLUMN teleport_bits VARCHAR(8);"))
                if "pauli_correction" not in cols:
                    conn.execute(text("ALTER TABLE signatures ADD COLUMN pauli_correction VARCHAR(16);"))
                if "teleport_fidelity" not in cols:
                    conn.execute(text("ALTER TABLE signatures ADD COLUMN teleport_fidelity FLOAT DEFAULT 1.0;"))
            
            # Upgrade users table if missing api_key
            if "users" in inspector.get_table_names():
                u_cols = [c["name"] for c in inspector.get_columns("users")]
                if "api_key" not in u_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN api_key VARCHAR(64);"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
