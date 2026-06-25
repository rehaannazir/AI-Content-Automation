from sqlmodel import Session

from models.generation import Generation
from repositories.generation_repo import GenerationRepository


class HistoryService:

    @staticmethod
    def get_all_history(session: Session, user_id: int):
        return GenerationRepository.get_user_generations(session, user_id)

    @staticmethod
    def get_history_by_id(session: Session, generation_id: int, user_id: int):
        return GenerationRepository.get_generation_by_id(session, generation_id, user_id)

    @staticmethod
    def delete_history(session: Session, generation_id: int, user_id: int):
        generation = HistoryService.get_history_by_id(session, generation_id, user_id)

        if not generation:
            return None

        GenerationRepository.delete_generation(session, generation)

        return generation

    @staticmethod
    def save_generation(session: Session, prompt: str, result: str, generation_type: str, user_id: int):
        generation = Generation(
            prompt=prompt,
            result=result,
            generation_type=generation_type,
            user_id=user_id,
        )

        return GenerationRepository.create_generation(session, generation)