from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):

    name: str
    email: EmailStr
    passward: str


class LoginRequest(BaseModel):
    email: EmailStr
    passward: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
