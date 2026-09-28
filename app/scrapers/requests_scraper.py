from typing import Any
import requests
from bs4 import BeautifulSoup
from app.core.exceptions import (
    InvalidURLException,
    NetworkException,
    ParsingException,
)
from app.core.logger import logger
from app.core.config import settings
from app.scrapers.base_scraper import BaseScraper

class RequestsScraper(BaseScraper):
    """
    Scraper implementation using requests and BeautifulSoup.
    """

    def scrape(self, url: str) -> list[dict[str, Any]]:
        self._validate_url(url)
        try:
            logger.info("Starting scrape for URL: %s", url)
            response = requests.get(
                url,
                timeout=settings.REQUEST_TIMEOUT,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 "
                        "(Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 "
                        "(KHTML, like Gecko) "
                        "Chrome/140.0 Safari/537.36"
                    )
                },
            )
            response.raise_for_status()

        except requests.exceptions.Timeout as exc:
            logger.error("Request timed out: %s", url)
            raise NetworkException(
                f"Request timed out for URL: {url}"
            ) from exc

        except requests.exceptions.RequestException as exc:
            logger.error("Network error for %s: %s", url, exc)
            raise NetworkException(
                f"Failed to fetch URL: {url}"
            ) from exc

        try:
            soup = BeautifulSoup(response.text, "html.parser")
            data = self._extract_data(soup, url)
            logger.info(
                "Successfully scraped %d elements from %s",
                len(data),
                url,
            )
            return data

        except Exception as exc:
            logger.exception("Failed to parse URL: %s", url)
            raise ParsingException(
                f"Failed to parse webpage: {url}"
            ) from exc

    @staticmethod
    def _validate_url(url: str) -> None:
        if not url:
            raise InvalidURLException("URL cannot be empty.")

        if not url.startswith(("http://", "https://")):
            raise InvalidURLException(
                "URL must start with http:// or https://"
            )

    @staticmethod
    def _extract_data(
        soup: BeautifulSoup,
        url: str,
    ) -> list[dict[str, Any]]:
        """
        Generic extraction strategy.

        Extracts common textual elements from the page
        without relying on website-specific selectors.
        """

        data = []
        title = soup.title.get_text(strip=True) if soup.title else None
        headings = [
            heading.get_text(" ", strip=True)
            for heading in soup.find_all(["h1", "h2", "h3"])
        ]
        paragraphs = [
            paragraph.get_text(" ", strip=True)
            for paragraph in soup.find_all("p")
        ]
        links = [
            {
                "text": link.get_text(" ", strip=True),
                "href": link.get("href"),
            }
            for link in soup.find_all("a", href=True)
        ]
        data.append(
            {
                "url": url,
                "title": title,
                "headings": headings,
                "paragraphs": paragraphs,
                "links": links,
            }
        )
        return data
