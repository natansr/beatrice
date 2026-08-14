from pathlib import Path
from app.exporters.base import BaseExporter


class TxtExporter(BaseExporter):
    format_name, extension = "txt", ".txt"

    def export(self, project, options, destination: Path):
        chunks = []
        if options.include_metadata:
            chunks.append(f"{project.title}\n{project.author}".strip())
        for page in self.pages(project, options):
            marker = f"{'=' * 20}\nPÁGINA {page.page_number}\n{'=' * 20}\n" if options.include_page_numbers else ""
            chunks.append(marker + self.text(page, options))
        destination.write_text("\n\n".join(chunks), encoding="utf-8")
        return destination

