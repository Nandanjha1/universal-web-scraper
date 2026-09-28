from typing import Any

from app.scrapers.base_scraper import BaseScraper
from app.scrapers.browser_scraper import BrowserScraper
from app.scrapers.requests_scraper import RequestsScraper
from app.core.logger import logger


class GenericScraper(BaseScraper):
    """
    Automatically selects the appropriate scraping strategy.
    """

    def __init__(
        self,
        requests_scraper: RequestsScraper,
        browser_scraper: BrowserScraper,
    ):
        self._requests_scraper = requests_scraper
        self._browser_scraper = browser_scraper

    def scrape(self, url: str) -> list[dict[str, Any]]:
        logger.info(
            "Attempting HTTP scraping first: %s",
            url,
        )
        try:
            data = self._requests_scraper.scrape(url)
            if self._has_useful_content(data):
                logger.info(
                    "HTTP scraper returned usable content."
                )
                return data

        except Exception as exc:

            logger.warning(
                "HTTP scraper failed: %s",
                exc,
            )
        logger.info(
            "Falling back to browser scraper: %s",
            url,
        )
        return self._browser_scraper.scrape(url)

    @staticmethod
    def _has_useful_content(
        data: list[dict[str, Any]]
    ) -> bool:

        if not data:
            return False
        first_item = data[0]
        return bool(
            first_item.get("title")
            or first_item.get("headings")
            or first_item.get("paragraphs")
            or first_item.get("links")
        )
