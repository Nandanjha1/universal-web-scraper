from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl

class ScrapedLink(BaseModel):
    text: str = ""
    href: str

class ScrapedPage(BaseModel):
    url: HttpUrl
    title: str | None = None
    headings: list[str] = Field(default_factory=list)
    paragraphs: list[str] = Field(default_factory=list)
    links: list[ScrapedLink] = Field(default_factory=list)
    scraped_at: datetime = Field(
        default_factory=datetime.utcnow
    )

class ScrapeRequest(BaseModel):
    url: HttpUrl
