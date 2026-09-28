from fastapi import APIRouter, Depends, HTTPException, status
from app.core.exceptions import DatabaseQueryException
from app.repositories.scraped_data_repository import (
    ScrapedDataRepository,
)
from app.schemas.scrape_schema import ScrapedPage
from app.services.crud_service import CrudService

router = APIRouter(
    prefix="/data",
    tags=["CRUD"],
)

def get_crud_service() -> CrudService:
    repository = ScrapedDataRepository()
    return CrudService(repository)

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
def create_data(
    page: ScrapedPage,
    service: CrudService = Depends(get_crud_service),
):
    try:
        return {
            "success": True,
            "message": "Record created successfully",
            "data": service.create(page),
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

@router.get("/")
def get_all_data(
    service: CrudService = Depends(get_crud_service),
):
    try:
        return {
            "success": True,
            "data": service.get_all(),
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

@router.get("/{record_id}")
def get_data_by_id(
    record_id: int,
    service: CrudService = Depends(get_crud_service),
):
    try:
        data = service.get_by_id(record_id)
        if data is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Record not found.",
            )
        return {
            "success": True,
            "data": data,
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

@router.put("/{record_id}")
def update_data(
    record_id: int,
    page: ScrapedPage,
    service: CrudService = Depends(get_crud_service),
):
    try:
        data = service.update(
            record_id,
            page,
        )
        if data is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Record not found.",
            )
        return {
            "success": True,
            "message": "Record updated successfully",
            "data": data,
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

@router.delete("/{record_id}")
def delete_data(
    record_id: int,
    service: CrudService = Depends(get_crud_service),
):
    try:
        deleted = service.delete(record_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Record not found.",
            )
        return {
            "success": True,
            "message": "Record deleted successfully",
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
