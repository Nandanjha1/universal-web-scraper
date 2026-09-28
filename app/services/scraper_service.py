from typing import Any
from app.repositories.base_repository import BaseRepository
from app.schemas.scrape_schema import ScrapedPage
from app.services.data_normalizer import DataNormalizer
from app.scrapers.base_scraper import BaseScraper

class ScrapeService:
    def __init__(
        self,
        scraper: BaseScraper,
        repository: BaseRepository,
    ):
        self._scraper = scraper
        self._repository = repository
        self._normalizer = DataNormalizer()

    def scrape_and_save(
        self,
        url: str,
    ) -> dict[str, Any]:
        # 1. Scrape website
        raw_data = self._scraper.scrape(url)
        # 2. Normalize scraped data
        pages: list[ScrapedPage] = (
            self._normalizer.normalize(raw_data)
        )
        if not pages:
            raise ValueError(
                "No data could be extracted from the website."
            )
        # 3. Save normalized data
        saved_records = []

        for page in pages:
            record = self._repository.create(
                page.model_dump(mode="json")
            )

            saved_records.append(record)
        return {
            "scraped_count": len(saved_records),
            "records": saved_records,
        }
