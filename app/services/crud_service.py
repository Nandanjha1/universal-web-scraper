from typing import Any
from app.repositories.base_repository import BaseRepository
from app.schemas.scrape_schema import ScrapedPage

class CrudService:
    def __init__(self, repository: BaseRepository):
        self._repository = repository

    def create(
        self,
        page: ScrapedPage,
    ) -> dict[str, Any]:

        return self._repository.create(
            page.model_dump(mode="json")
        )

    def get_all(self) -> list[dict[str, Any]]:
        return self._repository.get_all()

    def get_by_id(
        self,
        record_id: int,
    ) -> dict[str, Any] | None:

        return self._repository.get_by_id(
            record_id
        )

    def update(
        self,
        record_id: int,
        page: ScrapedPage,
    ) -> dict[str, Any] | None:

        return self._repository.update(
            record_id,
            page.model_dump(mode="json"),
        )

    def delete(self, record_id: int) -> bool:
        return self._repository.delete(record_id)
