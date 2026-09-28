from fastapi import APIRouter, Depends, HTTPException, status
from app.core.exceptions import (
    DatabaseQueryException,
    ScraperException,
)
from app.repositories.base_repository import BaseRepository
from app.repositories.scraped_data_repository import (
    ScrapedDataRepository,
)
from app.schemas.scrape_schema import ScrapeRequest
from app.scrapers.base_scraper import BaseScraper
from app.scrapers.scraper_factory import ScraperFactory
from app.services.scraper_service import ScrapeService
# from app.services.scrape_service import ScrapeService

router = APIRouter(
    prefix="/scrape",
    tags=["Scraping"],
)

def get_scraper() -> BaseScraper:
    return ScraperFactory.create_scraper()

def get_repository() -> BaseRepository:
    return ScrapedDataRepository()

def get_scrape_service(
    scraper: BaseScraper = Depends(get_scraper),
    repository: BaseRepository = Depends(get_repository),
) -> ScrapeService:

    return ScrapeService(
        scraper=scraper,
        repository=repository,
    )

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
def scrape_website(
    request: ScrapeRequest,
    service: ScrapeService = Depends(
        get_scrape_service
    ),
):
    try:
        result = service.scrape_and_save(
            str(request.url)
        )
        return {
            "success": True,
            "message": (
                "Website scraped and data "
                "stored successfully."
            ),
            "data": result,
        }

    except ScraperException as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=str(exc),
        ) from exc
