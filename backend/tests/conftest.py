import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from app.database.database import Base, get_db
import app.database.database as db_module
from app.database.seed import seed_database
from app.main import app

# Isolated in-memory SQLite database for test execution
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    original_engine = db_module.engine
    original_session = db_module.SessionLocal
    db_module.engine = test_engine
    db_module.SessionLocal = TestingSessionLocal

    Base.metadata.create_all(bind=test_engine)
    test_session = TestingSessionLocal()
    try:
        seed_database(db=test_session)
    finally:
        test_session.close()

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield

    Base.metadata.drop_all(bind=test_engine)
    db_module.engine = original_engine
    db_module.SessionLocal = original_session
    app.dependency_overrides.pop(get_db, None)

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
