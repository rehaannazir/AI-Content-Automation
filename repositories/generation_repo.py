# app/repositories/generation_repo.py

from sqlmodel import Session, select

from models.generation import Generation


class GenerationRepository:

    @staticmethod
    def create_generation(
        session: Session,
        generation: Generation,
    ):
        session.add(generation)
        session.commit()
        session.refresh(generation)

        return generation

    @staticmethod
    def get_user_generations(
        session: Session,
        user_id: int,
    ):
        return session.exec(
            select(Generation).where(
                Generation.user_id == user_id
            )
        ).all()

    @staticmethod
    def get_generation_by_id(
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
    def delete_generation(
        session: Session,
        generation: Generation,
    ):
        session.delete(generation)
        session.commit()