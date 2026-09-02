import pytest
from app.database.database import engine, Base, SessionLocal
from app.database.seed import seed_database

@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield
