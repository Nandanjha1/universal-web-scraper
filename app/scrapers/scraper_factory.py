# from app.scrapers.base_scraper import BaseScraper
# from app.scrapers.requests_scraper import RequestsScraper
# from app.scrapers.browser_scraper import BrowserScraper

# class ScraperFactory:
#     @staticmethod
#     def create_scraper(
#         scraper_type: str = "requests",
#     ) -> BaseScraper:

#         scraper_type = scraper_type.lower()

#         if scraper_type == "requests":
#             return RequestsScraper()

#         if scraper_type == "browser":
#             return BrowserScraper()

#         raise ValueError(
#             f"Unsupported scraper type: {scraper_type}"
#         )

from app.scrapers.base_scraper import BaseScraper
from app.scrapers.browser_scraper import BrowserScraper
from app.scrapers.generic_scraper import GenericScraper
from app.scrapers.requests_scraper import RequestsScraper

class ScraperFactory:
    @staticmethod
    def create_scraper() -> BaseScraper:
        requests_scraper = RequestsScraper()
        browser_scraper = BrowserScraper()

        return GenericScraper(
            requests_scraper=requests_scraper,
            browser_scraper=browser_scraper,
        )
