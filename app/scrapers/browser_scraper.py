from typing import Any
from playwright.sync_api import (
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)
from app.core.config import settings
from app.core.exceptions import (
    InvalidURLException,
    NetworkException,
    ParsingException,
)
from app.core.logger import logger
from app.scrapers.base_scraper import BaseScraper

class BrowserScraper(BaseScraper):
    """
    Scraper implementation using Playwright.

    This scraper opens the website in a real Chromium browser,
    allowing JavaScript-rendered content to load.
    """

    def scrape(self, url: str) -> list[dict[str, Any]]:
        self._validate_url(url)
        logger.info("Starting browser scraping for URL: %s", url)
        try:
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(
                    headless=True
                )
                page = browser.new_page()
                page.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=settings.REQUEST_TIMEOUT * 1000,
                )
                # Give JavaScript a short opportunity to render.
                page.wait_for_timeout(2000)
                html = page.content()
                title = page.title()
                browser.close()

            data = self._extract_data(
                html=html,
                url=url,
                title=title,
            )
            logger.info(
                "Browser scraping completed for: %s",
                url,
            )
            return data

        except PlaywrightTimeoutError as exc:
            logger.error(
                "Browser request timed out: %s",
                url,
            )
            raise NetworkException(
                f"Browser request timed out for URL: {url}"
            ) from exc

        except Exception as exc:
            logger.exception(
                "Browser scraping failed: %s",
                url,
            )
            raise ParsingException(
                f"Failed to scrape dynamic website: {url}"
            ) from exc

    @staticmethod
    def _validate_url(url: str) -> None:
        if not url:
            raise InvalidURLException(
                "URL cannot be empty."
            )

        if not url.startswith(
            ("http://", "https://")
        ):
            raise InvalidURLException(
                "URL must start with http:// or https://"
            )

    @staticmethod
    def _extract_data(
        html: str,
        url: str,
        title: str,
    ) -> list[dict[str, Any]]:

        from bs4 import BeautifulSoup

        soup = BeautifulSoup(
            html,
            "html.parser",
        )

        headings = [
            heading.get_text(
                " ",
                strip=True,
            )
            for heading in soup.find_all(
                ["h1", "h2", "h3"]
            )
        ]

        paragraphs = [
            paragraph.get_text(
                " ",
                strip=True,
            )
            for paragraph in soup.find_all("p")
        ]

        links = [
            {
                "text": link.get_text(
                    " ",
                    strip=True,
                ),
                "href": link.get("href"),
            }
            for link in soup.find_all(
                "a",
                href=True,
            )
        ]

        return [
            {
                "url": url,
                "title": title,
                "headings": headings,
                "paragraphs": paragraphs,
                "links": links,
            }
        ]
