from typing import Any
from pydantic import BaseModel

class ScrapeResponse(BaseModel):
    success: bool
    message: str
    data: list[dict[str, Any]]
