from fastapi import UploadFile
from sqlmodel import Session, select
from pathlib import Path
import shutil

from models.file import File as FileModel

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".docx"}
UPLOAD_DIR = "uploaded_files"


class FileService:

    @staticmethod
    def validate_extension(filename: str) -> str | None:
        extension = Path(filename).suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            return None
        return extension

    @staticmethod
    def save_to_disk(file: UploadFile) -> str:
        Path(UPLOAD_DIR).mkdir(exist_ok=True)
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_path

    @staticmethod
    def create_file_record(session: Session, filename: str, filepath: str, file_type: str, user_id: int) -> FileModel:
        new_file = FileModel(
            filename=filename,
            filepath=filepath,
            file_type=file_type,
            user_id=user_id,
        )
        session.add(new_file)
        session.commit()
        session.refresh(new_file)
        return new_file

    @staticmethod
    def get_user_files(session: Session, user_id: int) -> list[FileModel]:
        return session.exec(
            select(FileModel).where(FileModel.user_id == user_id)
        ).all()

    @staticmethod
    def get_file_by_id(session: Session, file_id: int, user_id: int) -> FileModel | None:
        return session.exec(
            select(FileModel).where(
                (FileModel.id == file_id) & (FileModel.user_id == user_id)
            )
        ).first()