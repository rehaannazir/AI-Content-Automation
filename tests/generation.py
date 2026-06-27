from unittest.mock import patch

from fastapi.testclient import TestClient

SAMPLE_TEXT = "Artificial intelligence is transforming modern industries by automating repetitive tasks."


# ── Summary ───────────────────────────────────────────────────────────────────

def test_generate_summary(auth_client: TestClient):
    with patch("routers.generate.GenerationService.generate_summary") as mock:
        mock.return_value = {"summary": "AI is changing industries."}
        res = auth_client.post("/generate/summary", json={"text": SAMPLE_TEXT})
    assert res.status_code == 200
    assert "summary" in res.json()


def test_generate_summary_empty_text_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/summary", json={"text": ""})
    assert res.status_code == 400


def test_generate_summary_whitespace_only_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/summary", json={"text": "   "})
    assert res.status_code == 400


def test_generate_summary_too_long_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/summary", json={"text": "a" * 10001})
    assert res.status_code == 400


def test_generate_summary_requires_auth(client: TestClient):
    res = client.post("/generate/summary", json={"text": SAMPLE_TEXT})
    assert res.status_code == 401


# ── Titles ────────────────────────────────────────────────────────────────────

def test_generate_titles(auth_client: TestClient):
    with patch("routers.generate.GenerationService.generate_titles") as mock:
        mock.return_value = {"titles": ["T1", "T2", "T3", "T4", "T5"]}
        res = auth_client.post("/generate/title", json={"text": SAMPLE_TEXT})
    assert res.status_code == 200
    assert len(res.json()["titles"]) == 5


def test_generate_titles_empty_text_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/title", json={"text": ""})
    assert res.status_code == 400


def test_generate_titles_requires_auth(client: TestClient):
    res = client.post("/generate/title", json={"text": SAMPLE_TEXT})
    assert res.status_code == 401


# ── Keywords ──────────────────────────────────────────────────────────────────

def test_generate_keywords(auth_client: TestClient):
    with patch("routers.generate.GenerationService.generate_keywords") as mock:
        mock.return_value = {"keywords": ["ai", "tech", "ml", "data", "automation", "future", "industry", "machine", "learning", "innovation"]}
        res = auth_client.post("/generate/keywords", json={"text": SAMPLE_TEXT})
    assert res.status_code == 200
    assert len(res.json()["keywords"]) == 10


def test_generate_keywords_empty_text_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/keywords", json={"text": ""})
    assert res.status_code == 400


def test_generate_keywords_requires_auth(client: TestClient):
    res = client.post("/generate/keywords", json={"text": SAMPLE_TEXT})
    assert res.status_code == 401


# ── Social posts ──────────────────────────────────────────────────────────────

def test_generate_social_posts(auth_client: TestClient):
    with patch("routers.generate.GenerationService.generate_social_posts") as mock:
        mock.return_value = {
            "linkedin": "AI is transforming industries.",
            "instagram": "#AI #Tech #Innovation",
            "twitter": "AI is the future! 🚀",
        }
        res = auth_client.post("/generate/social", json={"text": SAMPLE_TEXT})
    assert res.status_code == 200
    body = res.json()
    assert "linkedin" in body
    assert "instagram" in body
    assert "twitter" in body


def test_generate_social_empty_text_returns_400(auth_client: TestClient):
    res = auth_client.post("/generate/social", json={"text": ""})
    assert res.status_code == 400


def test_generate_social_requires_auth(client: TestClient):
    res = client.post("/generate/social", json={"text": SAMPLE_TEXT})
    assert res.status_code == 401
