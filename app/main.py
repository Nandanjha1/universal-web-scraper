from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from app.api.crud_routes import router as crud_router
from app.api.scrape_routes import router as scrape_router
from app.api.schema_routes import router as schema_router
from app.core.config import settings
from app.core.exceptions import ScraperException
from app.database.migrations import create_tables
from app.scrapers.scraper_factory import ScraperFactory
from fastapi.middleware.cors import CORSMiddleware
from app.api.csv_routes import router as csv_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Universal Web Scraper API",
    lifespan=lifespan,
)
app.include_router(scrape_router)
app.include_router(crud_router)
app.include_router(schema_router)
app.include_router(csv_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Universal Web Scraper API is running",
        "version": settings.APP_VERSION,
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.get("/test-scrape")
def test_scrape(url: str):
    try:
        scraper = ScraperFactory.create_scraper()
        service = ScraperService(scraper)
        data = service.scrape(url)
        return {
            "success": True,
            "message": "Website scraped successfully",
            "data": data,
        }

    except ScraperException as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
