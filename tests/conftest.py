import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session
from auth.dependencies import get_current_user
from auth.passward import hashing_pswd
from models.user import User


@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(engine):
    def override_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
    user = User(
        username="testuser",
        email="test@example.com",
        passward_hash=hashing_pswd("securepass1"),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="auth_client")
def auth_client_fixture(engine, test_user: User):
    def override_session():
        with Session(engine) as session:
            yield session

    def override_auth():
        return test_user

    app.dependency_overrides[get_session] = override_session
    app.dependency_overrides[get_current_user] = override_auth
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
