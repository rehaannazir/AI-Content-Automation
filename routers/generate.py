from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database import get_session
from auth.dependencies import get_current_user
from models.user import User

from schemas.generation_schema import (
    SummaryRequest,
    SummaryResponse,
    TitleRequest,
    TitleResponse,
    KeywordRequest,
    KeywordResponse,
    SocialRequest,
    SocialResponse,
)

# from app.services.generation_service import GenerationService

router = APIRouter(prefix="/generate", tags=["AI Generation"])
