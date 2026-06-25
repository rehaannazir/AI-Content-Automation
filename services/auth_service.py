from sqlmodel import Session

from auth.passward import hashing_passward, verify_passward
from repositories.user_repo import UserRepository
from utils.validators import validate_password


class AuthService:

    @staticmethod
    def get_user_by_email(session: Session, email: str):
        return UserRepository.get_user_by_email(session, email)

    @staticmethod
    def register_user(session: Session, username: str, email: str, password: str):
        validate_password(password)

        existing_email = UserRepository.get_user_by_email(session, email)
        existing_username = UserRepository.get_user_by_username(session, username)

        if existing_email or existing_username:
            return None

        from models.user import User
        new_user = User(
            username=username,
            email=email,
            passward_hash=hashing_passward(password),
        )

        return UserRepository.create_user(session, new_user)

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str):

        user = AuthService.get_user_by_email(session, email)

        if not user:
            return None

        if not verify_passward(password, user.passward_hash):
            return None

        return user
