from datetime import datetime
from typing import Any

from app.schemas.scrape_schema import (
    ScrapedLink,
    ScrapedPage,
)

class DataNormalizer:
    """
    Converts raw scraper output into a common
    application-level data structure.
    """

    @staticmethod
    def normalize(
        raw_data: list[dict[str, Any]]
    ) -> list[ScrapedPage]:

        normalized_data = []

        for item in raw_data:
            links = [
                ScrapedLink(
                    text=link.get("text", ""),
                    href=link.get("href", ""),
                )
                for link in item.get("links", [])
                if link.get("href")
            ]

            page = ScrapedPage(
                url=item["url"],
                title=item.get("title"),
                headings=item.get("headings", []),
                paragraphs=item.get(
                    "paragraphs",
                    []
                ),
                links=links,
                scraped_at=datetime.utcnow(),
            )
            normalized_data.append(page)

        return normalized_data
