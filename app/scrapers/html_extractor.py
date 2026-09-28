from typing import Any

from bs4 import BeautifulSoup


class HTMLExtractor:
    """Extract structured content from HTML."""

    def extract(
        self,
        html: str,
        url: str,
    ) -> dict[str, Any]:
        soup = BeautifulSoup(
            html,
            "html.parser",
        )

        return {
            "url": url,
            "title": self._extract_title(soup),
            "headings": self._extract_headings(soup),
            "paragraphs": self._extract_paragraphs(soup),
            "links": self._extract_links(soup),
        }

    @staticmethod
    def _extract_title(
        soup: BeautifulSoup,
    ) -> str | None:
        if soup.title:
            return soup.title.get_text(
                strip=True
            )

        return None

    @staticmethod
    def _extract_headings(
        soup: BeautifulSoup,
    ) -> list[str]:
        return [
            heading.get_text(strip=True)
            for heading in soup.find_all(
                ["h1", "h2", "h3", "h4", "h5", "h6"]
            )
            if heading.get_text(strip=True)
        ]

    @staticmethod
    def _extract_paragraphs(
        soup: BeautifulSoup,
    ) -> list[str]:
        return [
            paragraph.get_text(strip=True)
            for paragraph in soup.find_all("p")
            if paragraph.get_text(strip=True)
        ]

    @staticmethod
    def _extract_links(
        soup: BeautifulSoup,
    ) -> list[dict[str, str]]:
        links = []

        for anchor in soup.find_all("a"):
            href = anchor.get("href")

            if not href:
                continue

            links.append(
                {
                    "text": anchor.get_text(
                        strip=True
                    ),
                    "href": href,
                }
            )

        return links