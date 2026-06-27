from pydantic import BaseModel
from typing import List
from datetime import datetime


class SummaryRequest(BaseModel):
    text: str


class SummaryResponse(BaseModel):
    summary: str


class TitleRequest(BaseModel):
    text: str


class TitleResponse(BaseModel):
    titles: List[str]


class KeywordRequest(BaseModel):
    text: str


class KeywordResponse(BaseModel):
    keywords: List[str]


class SocialRequest(BaseModel):
    text: str


class SocialResponse(BaseModel):
    linkedin: str
    instagram: str
    twitter: str


class GenerationResponse(BaseModel):
    id: int
    prompt: str
    result: str
    generation_type: str
    created_at: datetime
    user_id: int


class GenerationListResponse(BaseModel):

    generations: List[GenerationResponse]
