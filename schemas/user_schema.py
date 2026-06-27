from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):

    name: str
    email: EmailStr
    passward: str


class UserLogin(BaseModel):
    email: EmailStr
    passward: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
