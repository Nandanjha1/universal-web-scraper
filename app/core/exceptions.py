class ScraperException(Exception):
    """Base exception for scraper-related errors."""
    pass

class InvalidURLException(ScraperException):
    """Raised when the provided URL is invalid."""
    pass

class NetworkException(ScraperException):
    """Raised when a network request fails."""
    pass

class ParsingException(ScraperException):
    """Raised when webpage parsing fails."""
    pass

class DatabaseException(Exception):
    """Base exception for database-related errors."""
    pass

class DatabaseConnectionException(DatabaseException):
    """Raised when database connection fails."""
    pass

class DatabaseQueryException(DatabaseException):
    """Raised when a database query fails."""
    pass
