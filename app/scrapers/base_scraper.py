from abc import ABC, abstractmethod
from typing import Any

class BaseScraper(ABC):
    """
    Abstract base class for all scraper implementations.
    """

    @abstractmethod
    def scrape(self, url: str) -> list[dict[str, Any]]:
        """
        Scrape data from the given URL.

        Args:
            url: Website URL to scrape.

        Returns:
            Structured scraped data.
        """
        pass
