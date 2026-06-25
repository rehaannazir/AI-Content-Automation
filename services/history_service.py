# app/services/history_service.py

from sqlmodel import Session, select

from models.generation import Generation


class HistoryService:

    @staticmethod
    def get_all_history(
        session: Session,
        user_id: int,
    ):
        return session.exec(
            select(Generation).where(
                Generation.user_id == user_id
            )
        ).all()

    @staticmethod
    def get_history_by_id(
        session: Session,
        generation_id: int,
        user_id: int,
    ):
        return session.exec(
            select(Generation).where(
                Generation.id == generation_id,
                Generation.user_id == user_id,
            )
        ).first()

    @staticmethod
    def delete_history(
        session: Session,
        generation_id: int,
        user_id: int,
    ):
        generation = HistoryService.get_history_by_id(
            session,
            generation_id,
            user_id,
        )

        if not generation:
            return None

        session.delete(generation)
        session.commit()

        return generation

    @staticmethod
    def save_generation(
        session: Session,
        prompt: str,
        result: str,
        generation_type: str,
        user_id: int,
    ):
        generation = Generation(
            prompt=prompt,
            result=result,
            generation_type=generation_type,
            user_id=user_id,
        )

        session.add(generation)
        session.commit()
        session.refresh(generation)

        return generation