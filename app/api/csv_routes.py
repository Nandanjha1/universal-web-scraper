from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.repositories.scraped_data_repository import (
    ScrapedDataRepository,
)
from app.services.csv_service import CSVService


router = APIRouter(
    prefix="/export",
    tags=["CSV Export"],
)


def get_repository():
    return ScrapedDataRepository()


def get_csv_service():
    return CSVService()


@router.get("/csv")
def export_csv(
    repository: ScrapedDataRepository = Depends(
        get_repository
    ),
    csv_service: CSVService = Depends(
        get_csv_service
    ),
):
    records = repository.get_all()

    csv_content = csv_service.generate_csv(
        records
    )

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                "attachment; "
                'filename="scraped_data.csv"'
            )
        },
    )