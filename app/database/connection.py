from contextlib import contextmanager
from typing import Generator
import psycopg2
from psycopg2.extensions import connection
from app.core.config import settings
from app.core.exceptions import DatabaseConnectionException
from app.core.logger import logger


class DatabaseConnection:
    @staticmethod
    @contextmanager
    def get_connection() -> Generator[connection, None, None]:
        try:
            conn = psycopg2.connect(
                host=settings.DATABASE_HOST,
                port=settings.DATABASE_PORT,
                database=settings.DATABASE_NAME,
                user=settings.DATABASE_USER,
                password=settings.DATABASE_PASSWORD,
            )

        except psycopg2.Error as exc:
            logger.exception(
                "Failed to connect to PostgreSQL."
            )
            raise DatabaseConnectionException(
                "Unable to connect to PostgreSQL."
            ) from exc
        logger.info("Database connection established.")

        try:
            yield conn

        finally:
            conn.close()
            logger.info(
                "Database connection closed."
            )
