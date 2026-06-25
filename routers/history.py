from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from auth.dependencies import get_current_user
from models.user import User
from schemas.generation_schema import GenerationResponse
from services.history_service import HistoryService

router = APIRouter(
    prefix="/history",
    tags=["History"],
)

@router.get(
    "",
    response_model=list[GenerationResponse],
    status_code=status.HTTP_200_OK,
)
def get_history(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return HistoryService.get_all_history(session, current_user.id)


@router.get(
    "/{generation_id}",
    response_model=GenerationResponse,
    status_code=status.HTTP_200_OK,
)
def get_generation(
    generation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    generation = HistoryService.get_history_by_id(session, generation_id, current_user.id)

    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found",
        )

    return generation


@router.delete(
    "/{generation_id}",
    status_code=status.HTTP_200_OK,
)
def delete_generation(
    generation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    generation = HistoryService.delete_history(session, generation_id, current_user.id)

    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found",
        )

    return {"message": "Generation deleted successfully"}