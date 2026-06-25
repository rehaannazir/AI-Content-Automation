from fastapi import HTTPException, status
from pathlib import Path

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".docx"}


def validate_file_type(filename: str):
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only txt, pdf and docx files are allowed.",
        )

    return extension

def validate_password(password: str):

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    if password.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be only numbers.",
        )
    
def validate_text(text: str):

    if not text or not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty.",
        )

    if len(text) > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text is too large (max 10,000 chars).",
        )