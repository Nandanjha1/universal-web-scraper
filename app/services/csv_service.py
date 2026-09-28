import csv
import io
from typing import Any

class CSVService:
    """Service responsible for converting records into CSV."""
    FIELDNAMES = [
        "id",
        "url",
        "title",
        "headings",
        "paragraphs",
        "links",
        "scraped_at",
    ]

    def generate_csv(
        self,
        records: list[dict[str, Any]],
    ) -> str:
        """Generate CSV content from database records."""
        output = io.StringIO()
        writer = csv.DictWriter(
            output,
            fieldnames=self.FIELDNAMES,
        )
        writer.writeheader()

        for record in records:
            writer.writerow(
                {
                    field: self._serialize(
                        record.get(field)
                    )
                    for field in self.FIELDNAMES
                }
            )

        return output.getvalue()

    @staticmethod
    def _serialize(value: Any) -> str:
        if value is None:
            return ""

        if isinstance(value, list):
            return "; ".join(
                str(item) for item in value
            )

        if isinstance(value, dict):
            return str(value)

        return str(value)