from fastapi import APIRouter, HTTPException, status
from app.core.exceptions import DatabaseQueryException
from app.services.schema_service import SchemaService

router = APIRouter(
    prefix="/schema",
    tags=["Schema"],
)

@router.get("/tables")
def get_tables():
    service = SchemaService()
    try:
        tables = service.get_tables()
        return {
            "success": True,
            "tables": tables,
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

@router.get("/tables/{table_name}")
def get_table_schema(
    table_name: str,
):
    service = SchemaService()
    try:
        columns = service.get_table_schema(
            table_name
        )
        if not columns:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Table '{table_name}' not found.",
            )

        return {
            "success": True,
            "table": table_name,
            "columns": columns,
        }

    except DatabaseQueryException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
