import io
from unittest.mock import patch

from fastapi.testclient import TestClient

from models.file import File as FileModel
from models.user import User


def _seed_file(session, user_id: int, filename: str = "test.txt") -> FileModel:
    record = FileModel(
        filename=filename,
        filepath=f"uploaded_files/{filename}",
        file_type=".txt",
        user_id=user_id,
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


# ── Upload ────────────────────────────────────────────────────────────────────

def test_upload_txt_file(auth_client: TestClient):
    with patch("routers.file.FileService.save_to_disk") as mock_save:
        mock_save.return_value = ("uploaded_files/test.txt", ".txt")
        res = auth_client.post(
            "/files/upload",
            files={"file": ("test.txt", io.BytesIO(b"Hello world"), "text/plain")},
        )
    assert res.status_code == 201


def test_upload_pdf_file(auth_client: TestClient):
    with patch("routers.file.FileService.save_to_disk") as mock_save:
        mock_save.return_value = ("uploaded_files/doc.pdf", ".pdf")
        res = auth_client.post(
            "/files/upload",
            files={"file": ("doc.pdf", io.BytesIO(b"%PDF-1.4 fake"), "application/pdf")},
        )
    assert res.status_code == 201


def test_upload_docx_file(auth_client: TestClient):
    with patch("routers.file.FileService.save_to_disk") as mock_save:
        mock_save.return_value = ("uploaded_files/report.docx", ".docx")
        res = auth_client.post(
            "/files/upload",
            files={"file": ("report.docx", io.BytesIO(b"fake docx bytes"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        )
    assert res.status_code == 201


def test_upload_invalid_file_type_returns_400(auth_client: TestClient):
    res = auth_client.post(
        "/files/upload",
        files={"file": ("script.py", io.BytesIO(b"print('hi')"), "text/plain")},
    )
    assert res.status_code == 400
    assert "txt, pdf" in res.json()["detail"]


def test_upload_requires_auth(client: TestClient):
    res = client.post(
        "/files/upload",
        files={"file": ("test.txt", io.BytesIO(b"Hello"), "text/plain")},
    )
    assert res.status_code == 401


# ── List files ────────────────────────────────────────────────────────────────

def test_get_files_empty_returns_404(auth_client: TestClient):
    res = auth_client.get("/files")
    assert res.status_code == 404


def test_get_files_returns_list(auth_client: TestClient, session, test_user: User):
    _seed_file(session, test_user.id, "a.txt")
    _seed_file(session, test_user.id, "b.txt")
    res = auth_client.get("/files")
    assert res.status_code == 200


def test_get_files_requires_auth(client: TestClient):
    res = client.get("/files")
    assert res.status_code == 401


# ── Get by ID ─────────────────────────────────────────────────────────────────

def test_get_file_by_id(auth_client: TestClient, session, test_user: User):
    record = _seed_file(session, test_user.id, "myfile.txt")
    res = auth_client.get(f"/files/{record.id}")
    assert res.status_code == 200
    assert res.json()["filename"] == "myfile.txt"


def test_get_file_by_id_not_found(auth_client: TestClient):
    res = auth_client.get("/files/9999")
    assert res.status_code == 404


def test_get_file_by_id_requires_auth(client: TestClient):
    res = client.get("/files/1")
    assert res.status_code == 401


def test_cannot_access_another_users_file(auth_client: TestClient, session):
    other_file = FileModel(
        filename="secret.txt",
        filepath="uploaded_files/secret.txt",
        file_type=".txt",
        user_id=9999,
    )
    session.add(other_file)
    session.commit()
    session.refresh(other_file)

    res = auth_client.get(f"/files/{other_file.id}")
    assert res.status_code == 404
