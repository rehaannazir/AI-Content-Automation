import json

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
from services.generation_service import GenerationService
from services.history_service import HistoryService
from utils.validators import validate_text

router = APIRouter(prefix="/generate", tags=["AI Generation"])


@router.post("/summary", response_model=SummaryResponse, status_code=status.HTTP_200_OK)
def generate_summary(
    data: SummaryRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    validate_text(data.text)
    result = GenerationService.generate_summary(data.text)
    HistoryService.save_generation(session, data.text, json.dumps(result), "summary", current_user.id)
    return result


@router.post("/title", response_model=TitleResponse, status_code=status.HTTP_200_OK)
def generate_titles(
    data: TitleRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    validate_text(data.text)
    result = GenerationService.generate_titles(data.text)
    HistoryService.save_generation(session, data.text, json.dumps(result), "title", current_user.id)
    return result


@router.post("/keywords", response_model=KeywordResponse, status_code=status.HTTP_200_OK)
def generate_keywords(
    data: KeywordRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    validate_text(data.text)
    result = GenerationService.generate_keywords(data.text)
    HistoryService.save_generation(session, data.text, json.dumps(result), "keywords", current_user.id)
    return result


@router.post("/social", response_model=SocialResponse, status_code=status.HTTP_200_OK)
def generate_social_posts(
    data: SocialRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    validate_text(data.text)
    result = GenerationService.generate_social_posts(data.text)
    HistoryService.save_generation(session, data.text, json.dumps(result), "social", current_user.id)
    return result
