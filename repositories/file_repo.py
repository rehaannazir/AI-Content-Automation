from sqlmodel import Session, select

from models.file import File


class FileRepository:

    @staticmethod
    def create_file(
        session: Session,
        file: File,
    ):
        session.add(file)
        session.commit()
        session.refresh(file)

        return file

    @staticmethod
    def get_user_files(
        session: Session,
        user_id: int,
    ):
        return session.exec(
            select(File).where(
                File.user_id == user_id
            )
        ).all()

    @staticmethod
    def get_file_by_id(
        session: Session,
        file_id: int,
        user_id: int,
    ):
        return session.exec(
            select(File).where(
                File.id == file_id,
                File.user_id == user_id,
            )
        ).first()

    @staticmethod
    def delete_file(
        session: Session,
        file: File,
    ):
        session.delete(file)
        session.commit()