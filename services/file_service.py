from fastapi import UploadFile
from sqlmodel import Session
from pathlib import Path
import shutil

from models.file import File as FileModel
from repositories.file_repo import FileRepository
from utils.validators import validate_file_type
from utils.file_parser import FileParser

UPLOAD_DIR = "uploaded_files"


class FileService:

    @staticmethod
    def save_to_disk(file: UploadFile) -> tuple[str, str]:
        extension = validate_file_type(file.filename)
        Path(UPLOAD_DIR).mkdir(exist_ok=True)
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_path, extension

    @staticmethod
    def create_file_record(session: Session, filename: str, filepath: str, file_type: str, user_id: int) -> FileModel:
        new_file = FileModel(
            filename=filename,
            filepath=filepath,
            file_type=file_type,
            user_id=user_id,
        )
        return FileRepository.create_file(session, new_file)

    @staticmethod
    def get_user_files(session: Session, user_id: int) -> list[FileModel]:
        return FileRepository.get_user_files(session, user_id)

    @staticmethod
    def get_file_by_id(session: Session, file_id: int, user_id: int) -> FileModel | None:
        return FileRepository.get_file_by_id(session, file_id, user_id)

    @staticmethod
    def extract_text(filepath: str) -> str:
        return FileParser.extract_text(filepath)