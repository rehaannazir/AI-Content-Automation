from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status,
)
from sqlmodel import Session, select
from pathlib import Path
import shutil

from app.database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.file import File as FileModel
from schemas.file_schema import FileResponse, FileListResponse

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_file(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    allowed_extensions = {".txt", ".pdf", ".docx"}

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only txt, pdf and docx files are allowed.",
        )

    file_path = f"uploaded_files/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_file = FileModel(
        filename=file.filename,
        filepath=file_path,
        file_type=extension,
        user_id=current_user.id,
    )

    session.add(new_file)
    session.commit()
    session.refresh(new_file)

    return new_file


@router.get("", response_model=FileListResponse, status_code=status.HTTP_200_OK)
def get_files(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    files = session.exec(
        select(FileModel).where(FileModel.user_id == current_user.id)
    ).all()

    if not files:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Files don't exist"
        )

    return files


@router.get("/{file_id}", response_model=FileResponse, status_code=status.HTTP_200_OK)
def get_file(
    file_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    file = session.exec(
        select(FileModel).where(
            FileModel.id == file_id & FileModel.user_id == current_user.id,
        )
    ).first()

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return file
