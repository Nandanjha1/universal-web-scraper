from typing import Any
from psycopg2.extras import Json
from app.core.exceptions import DatabaseQueryException
from app.database.connection import DatabaseConnection
from app.repositories.base_repository import BaseRepository

class ScrapedDataRepository(BaseRepository):
    def create(
        self,
        data: dict[str, Any]
    ) -> dict[str, Any]:

        query = """
        INSERT INTO scraped_pages
        (url, title, headings, paragraphs, links)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, url, title,
                  headings, paragraphs,
                  links, scraped_at;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        query,
                        (
                            str(data["url"]),
                            data.get("title"),
                            Json(data.get("headings", [])),
                            Json(data.get("paragraphs", [])),
                            Json(data.get("links", [])),
                        ),
                    )
                    record = cursor.fetchone()
                conn.commit()
            return self._to_dict(record)

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to create scraped record."
            ) from exc

    def get_all(self) -> list[dict[str, Any]]:
        query = """
        SELECT id, url, title,
               headings, paragraphs,
               links, scraped_at
        FROM scraped_pages
        ORDER BY id;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query)
                    records = cursor.fetchall()
            return [
                self._to_dict(record)
                for record in records
            ]

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to fetch scraped records."
            ) from exc

    def get_by_id(
        self,
        record_id: int
    ) -> dict[str, Any] | None:

        query = """
        SELECT id, url, title,
               headings, paragraphs,
               links, scraped_at
        FROM scraped_pages
        WHERE id = %s;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        query,
                        (record_id,),
                    )
                    record = cursor.fetchone()
            if not record:
                return None
            return self._to_dict(record)

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to fetch scraped record."
            ) from exc

    def update(
        self,
        record_id: int,
        data: dict[str, Any]
    ) -> dict[str, Any] | None:

        query = """
        UPDATE scraped_pages
        SET url = %s,
            title = %s,
            headings = %s,
            paragraphs = %s,
            links = %s
        WHERE id = %s
        RETURNING id, url, title,
                  headings, paragraphs,
                  links, scraped_at;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        query,
                        (
                            str(data["url"]),
                            data.get("title"),
                            Json(data.get("headings", [])),
                            Json(data.get("paragraphs", [])),
                            Json(data.get("links", [])),
                            record_id,
                        ),
                    )
                    record = cursor.fetchone()
                conn.commit()
            if not record:
                return None
            return self._to_dict(record)

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to update scraped record."
            ) from exc

    def delete(
        self,
        record_id: int
    ) -> bool:
        query = """
        DELETE FROM scraped_pages
        WHERE id = %s;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        query,
                        (record_id,),
                    )
                    deleted = cursor.rowcount > 0
                conn.commit()
            return deleted

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to delete scraped record."
            ) from exc

    @staticmethod
    def _to_dict(record) -> dict[str, Any]:
        return {
            "id": record[0],
            "url": record[1],
            "title": record[2],
            "headings": record[3],
            "paragraphs": record[4],
            "links": record[5],
            "scraped_at": record[6],
        }
