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
