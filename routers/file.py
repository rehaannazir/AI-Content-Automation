from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from auth.dependencies import get_current_user
from models.user import User
from repositories.file_repo import FileRepository
from schemas.file_schema import FileResponse, FileListResponse
from services.file_service import FileService
from utils.responses import success_response

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_file(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    file_path, extension = FileService.save_to_disk(file)
    return FileService.create_file_record(session, file.filename, file_path, extension, current_user.id)


@router.get("", response_model=FileListResponse, status_code=status.HTTP_200_OK)
def get_files(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    files = FileService.get_user_files(session, current_user.id)
    if not files:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Files don't exist")
    return {"files": files}


@router.get("/{file_id}/extract", status_code=status.HTTP_200_OK)
def extract_text(file_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    file = FileService.get_file_by_id(session, file_id, current_user.id)
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    text = FileService.extract_text(file.filepath)
    return {"text": text}


@router.get("/{file_id}", response_model=FileResponse, status_code=status.HTTP_200_OK)
def get_file(file_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    file = FileService.get_file_by_id(session, file_id, current_user.id)
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return file


@router.delete("/{file_id}", status_code=status.HTTP_200_OK)
def delete_file(file_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    file = FileService.get_file_by_id(session, file_id, current_user.id)
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    FileRepository.delete_file(session, file)
    return success_response("File deleted successfully")
