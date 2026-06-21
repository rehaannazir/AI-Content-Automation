from sqlmodel import Session, select

from models.user import User
from auth.passward import hashing_passward, verify_passward


class AuthService:

    @staticmethod
    def get_user_by_email(session: Session, email: str):
        return session.exec(select(User).where(User.email == email)).first()

    @staticmethod
    def register_user(session: Session, username: str, email: str, password: str):

        existing_user = session.exec(
            select(User).where((User.email == email) | (User.username == username))
        ).first()

        if existing_user:
            return None  # user already exists

        new_user = User(
            username=username,
            email=email,
            passward_hash=hashing_passward(password),
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return new_user

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str):

        user = AuthService.get_user_by_email(session, email)

        if not user:
            return None

        if not verify_passward(password, user.password_hash):
            return None

        return user
