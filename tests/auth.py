import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session

REGISTER_URL = "/auth/register"
LOGIN_URL = "/auth/login"

_USER = {
    "name": "testuser",
    "email": "test@example.com",
    "passward": "securepass1",
}


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def override_session():
        yield session

    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


# ── Register ──────────────────────────────────────────────────────────────────

def test_register_success(client: TestClient):
    res = client.post(REGISTER_URL, json=_USER)
    assert res.status_code == 201
    assert res.json()["success"] is True


def test_register_duplicate_email_returns_400(client: TestClient):
    client.post(REGISTER_URL, json=_USER)
    res = client.post(REGISTER_URL, json=_USER)
    assert res.status_code == 400


def test_register_duplicate_username_returns_400(client: TestClient):
    client.post(REGISTER_URL, json=_USER)
    different_email = {**_USER, "email": "other@example.com"}
    res = client.post(REGISTER_URL, json=different_email)
    assert res.status_code == 400


def test_register_short_password_returns_400(client: TestClient):
    res = client.post(REGISTER_URL, json={**_USER, "passward": "abc"})
    assert res.status_code == 400
    assert "8 characters" in res.json()["detail"]


def test_register_numeric_password_returns_400(client: TestClient):
    res = client.post(REGISTER_URL, json={**_USER, "passward": "12345678"})
    assert res.status_code == 400
    assert "numbers" in res.json()["detail"]


def test_register_invalid_email_returns_422(client: TestClient):
    res = client.post(REGISTER_URL, json={**_USER, "email": "not-an-email"})
    assert res.status_code == 422


# ── Login ─────────────────────────────────────────────────────────────────────

def test_login_success(client: TestClient):
    client.post(REGISTER_URL, json=_USER)
    res = client.post(
        LOGIN_URL,
        json={"email": _USER["email"], "passward": _USER["passward"]},
    )
    assert res.status_code == 200
    body = res.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_wrong_password_returns_401(client: TestClient):
    client.post(REGISTER_URL, json=_USER)
    res = client.post(
        LOGIN_URL,
        json={"email": _USER["email"], "passward": "wrongpassword"},
    )
    assert res.status_code == 401


def test_login_unknown_email_returns_401(client: TestClient):
    res = client.post(
        LOGIN_URL,
        json={"email": "nobody@example.com", "passward": "somepass123"},
    )
    assert res.status_code == 401
