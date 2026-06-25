from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session
from auth.jwt_handler import encode_access_token
from app.database import get_session
from schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse
from services.auth_service import AuthService
from utils.responses import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(reg: RegisterRequest, session: Session = Depends(get_session)):

    user = AuthService.register_user(session, reg.name, reg.email, reg.passward)

    if not user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already regitered"
        )

    return success_response("User is registered successfully!")


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login_user(user: LoginRequest, session: Session = Depends(get_session)):

    check_user = AuthService.authenticate_user(session, user.email, user.passward)

    if not check_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials"
        )

    token = encode_access_token({"sub": check_user.username})

    return {"access_token": token, "token_type": "bearer"}
