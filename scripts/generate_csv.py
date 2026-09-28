import csv
import json
import sys
from pathlib import Path

# Allow imports from the project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.repositories.scraped_data_repository import (
    ScrapedDataRepository,
)

OUTPUT_FILE = PROJECT_ROOT / "scraped_data.csv"

def serialize_json_field(value):
    """Convert JSON/list data into CSV-friendly text."""
    if value is None:
        return ""

    if isinstance(value, (list, dict)):
        return json.dumps(
            value,
            ensure_ascii=False,
        )
    return str(value)

def generate_csv():
    """Fetch scraped records and export them to CSV."""

    repository = ScrapedDataRepository()
    records = repository.get_all()

    if not records:
        print("No scraped records found.")
        return

    fieldnames = [
        "id",
        "url",
        "title",
        "headings",
        "paragraphs",
        "links",
        "scraped_at",
    ]

    with open(
        OUTPUT_FILE,
        mode="w",
        newline="",
        encoding="utf-8",
    ) as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=fieldnames,
        )
        writer.writeheader()

        for record in records:
            writer.writerow(
                {
                    "id": record.get("id"),
                    "url": record.get("url"),
                    "title": record.get("title"),
                    "headings": serialize_json_field(
                        record.get("headings")
                    ),
                    "paragraphs": serialize_json_field(
                        record.get("paragraphs")
                    ),
                    "links": serialize_json_field(
                        record.get("links")
                    ),
                    "scraped_at": record.get(
                        "scraped_at"
                    ),
                }
            )
    print(
        f"CSV generated successfully: {OUTPUT_FILE}"
    )
    print(f"Total records exported: {len(records)}")

if __name__ == "__main__":
    generate_csv()