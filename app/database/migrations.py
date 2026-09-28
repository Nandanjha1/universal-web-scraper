from app.database.connection import DatabaseConnection
from app.core.exceptions import DatabaseQueryException
from app.core.logger import logger

CREATE_TABLE_QUERY = """
CREATE TABLE IF NOT EXISTS scraped_pages (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    headings JSONB DEFAULT '[]'::jsonb,
    paragraphs JSONB DEFAULT '[]'::jsonb,
    links JSONB DEFAULT '[]'::jsonb,
    scraped_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""

def create_tables() -> None:
    try:
        with DatabaseConnection.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(CREATE_TABLE_QUERY)
            conn.commit()
        logger.info(
            "Database tables created successfully."
        )

    except Exception as exc:
        logger.exception(
            "Failed to create database tables."
        )
        raise DatabaseQueryException(
            "Failed to create database tables."
        ) from exc
