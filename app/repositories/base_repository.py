from abc import ABC, abstractmethod
from typing import Any

class BaseRepository(ABC):
    @abstractmethod
    def create(
        self,
        data: dict[str, Any]
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    def get_all(self) -> list[dict[str, Any]]:
        pass

    @abstractmethod
    def get_by_id(
        self,
        record_id: int
    ) -> dict[str, Any] | None:
        pass

    @abstractmethod
    def update(
        self,
        record_id: int,
        data: dict[str, Any]
    ) -> dict[str, Any] | None:
        pass

    @abstractmethod
    def delete(
        self,
        record_id: int
    ) -> bool:
        pass
