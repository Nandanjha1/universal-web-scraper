from typing import Any
from app.database.connection import DatabaseConnection
from app.core.exceptions import DatabaseQueryException

class SchemaService:
    def get_tables(self) -> list[str]:
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query)
                    records = cursor.fetchall()

            return [record[0] for record in records]

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to retrieve database tables."
            ) from exc

    def get_table_schema(
        self,
        table_name: str,
    ) -> list[dict[str, Any]]:

        query = """
        SELECT
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        ORDER BY ordinal_position;
        """

        try:
            with DatabaseConnection.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        query,
                        (table_name,),
                    )
                    records = cursor.fetchall()

            return [
                {
                    "column_name": record[0],
                    "data_type": record[1],
                    "is_nullable": record[2],
                    "default": record[3],
                }
                for record in records
            ]

        except Exception as exc:
            raise DatabaseQueryException(
                "Failed to retrieve table schema."
            ) from exc
