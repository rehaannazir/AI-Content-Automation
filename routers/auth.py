from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select
from auth.passward import hashing_passward, verify_passward
from auth.jwt_handler import encode_access_token
from app.database import get_session
from models.user import User
from schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse
from app.logger import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(reg: RegisterRequest, session: Session = Depends(get_session)):

    check_user = session.exec(
        select(User).where(
            User.username == reg.name | User.email == reg.email
        )  # Must check email to stop email duplication
    ).first()

    if check_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already regitered"
        )

    new_user = User(
        username=reg.name,
        email=reg.email,
        passward_hash=hashing_passward(reg.passward),
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User is registered successfully!"}


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login_user(user: LoginRequest, session: Session = Depends(get_session)):

    check_user = session.exec(select(User).where(User.email == user.email)).first()

    if not check_user or not verify_passward(user.passward, check_user.passward_hash):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials"
        )

    token = encode_access_token({"sub": check_user.username})

    return {"access_token": token, "token_type": "bearer"}
