# app/routers/generate.py

from fastapi import APIRouter, Depends, status

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

router = APIRouter(prefix="/generate", tags=["AI Generation"])


@router.post("/summary", response_model=SummaryResponse, status_code=status.HTTP_200_OK)
def generate_summary(
    data: SummaryRequest,
    current_user: User = Depends(get_current_user),
):
    return GenerationService.generate_summary(data.text)


@router.post("/title", response_model=TitleResponse, status_code=status.HTTP_200_OK)
def generate_titles(
    data: TitleRequest,
    current_user: User = Depends(get_current_user),
):
    return GenerationService.generate_titles(data.text)


@router.post("/keywords", response_model=KeywordResponse, status_code=status.HTTP_200_OK)
def generate_keywords(
    data: KeywordRequest,
    current_user: User = Depends(get_current_user),
):
    return GenerationService.generate_keywords(data.text)


@router.post("/social", response_model=SocialResponse, status_code=status.HTTP_200_OK)
def generate_social_posts(
    data: SocialRequest,
    current_user: User = Depends(get_current_user),
):
    return GenerationService.generate_social_posts(data.text)