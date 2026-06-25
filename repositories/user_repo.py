# app/repositories/user_repo.py

from sqlmodel import Session, select

from models.user import User


class UserRepository:

    @staticmethod
    def create_user(
        session: Session,
        user: User,
    ):
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @staticmethod
    def get_user_by_id(
        session: Session,
        user_id: int,
    ):
        return session.get(User, user_id)

    @staticmethod
    def get_user_by_email(
        session: Session,
        email: str,
    ):
        return session.exec(
            select(User).where(
                User.email == email
            )
        ).first()

    @staticmethod
    def get_user_by_username(
        session: Session,
        username: str,
    ):
        return session.exec(
            select(User).where(
                User.username == username
            )
        ).first()

    @staticmethod
    def update_user(
        session: Session,
        user: User,
    ):
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @staticmethod
    def delete_user(
        session: Session,
        user: User,
    ):
        session.delete(user)
        session.commit()