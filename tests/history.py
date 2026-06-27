from fastapi.testclient import TestClient

from models.generation import Generation
from models.user import User


def _seed_generation(
    session,
    user_id: int,
    prompt: str = "Test prompt",
    result: str = "Test result",
    gen_type: str = "summary",
) -> Generation:
    gen = Generation(prompt=prompt, result=result, generation_type=gen_type, user_id=user_id)
    session.add(gen)
    session.commit()
    session.refresh(gen)
    return gen


# ── Get all history ───────────────────────────────────────────────────────────

def test_get_history_empty_returns_empty_list(auth_client: TestClient):
    res = auth_client.get("/history")
    assert res.status_code == 200
    assert res.json() == []


def test_get_history_returns_items(auth_client: TestClient, session, test_user: User):
    _seed_generation(session, test_user.id, prompt="First")
    _seed_generation(session, test_user.id, prompt="Second")
    res = auth_client.get("/history")
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_get_history_requires_auth(client: TestClient):
    res = client.get("/history")
    assert res.status_code == 401


# ── Get by ID ─────────────────────────────────────────────────────────────────

def test_get_generation_by_id(auth_client: TestClient, session, test_user: User):
    gen = _seed_generation(session, test_user.id, prompt="My prompt")
    res = auth_client.get(f"/history/{gen.id}")
    assert res.status_code == 200
    assert res.json()["prompt"] == "My prompt"


def test_get_generation_by_id_not_found_returns_404(auth_client: TestClient):
    res = auth_client.get("/history/9999")
    assert res.status_code == 404


def test_get_generation_by_id_requires_auth(client: TestClient):
    res = client.get("/history/1")
    assert res.status_code == 401


# ── Delete ────────────────────────────────────────────────────────────────────

def test_delete_generation(auth_client: TestClient, session, test_user: User):
    gen = _seed_generation(session, test_user.id)
    res = auth_client.delete(f"/history/{gen.id}")
    assert res.status_code == 200
    assert res.json()["success"] is True


def test_delete_generation_not_found_returns_404(auth_client: TestClient):
    res = auth_client.delete("/history/9999")
    assert res.status_code == 404


def test_delete_generation_requires_auth(client: TestClient):
    res = client.delete("/history/1")
    assert res.status_code == 401


def test_deleted_generation_no_longer_accessible(auth_client: TestClient, session, test_user: User):
    gen = _seed_generation(session, test_user.id)
    auth_client.delete(f"/history/{gen.id}")
    res = auth_client.get(f"/history/{gen.id}")
    assert res.status_code == 404


# ── Isolation ─────────────────────────────────────────────────────────────────

def test_cannot_access_another_users_generation(auth_client: TestClient, session):
    other_gen = Generation(
        prompt="Other user's prompt",
        result="Other user's result",
        generation_type="summary",
        user_id=9999,
    )
    session.add(other_gen)
    session.commit()
    session.refresh(other_gen)

    res = auth_client.get(f"/history/{other_gen.id}")
    assert res.status_code == 404


def test_cannot_delete_another_users_generation(auth_client: TestClient, session):
    other_gen = Generation(
        prompt="Other user's prompt",
        result="Other user's result",
        generation_type="summary",
        user_id=9999,
    )
    session.add(other_gen)
    session.commit()
    session.refresh(other_gen)

    res = auth_client.delete(f"/history/{other_gen.id}")
    assert res.status_code == 404
