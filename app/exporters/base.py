from abc import ABC, abstractmethod
from pathlib import Path
from app.models import Project
from app.schemas.export import ExportOptions


class BaseExporter(ABC):
    format_name: str
    extension: str

    def pages(self, project: Project, options: ExportOptions):
        pages = sorted(project.pages, key=lambda p: p.page_number)
        if not options.include_unreviewed_pages:
            pages = [p for p in pages if p.status.value == "reviewed"]
        return pages

    def text(self, page, options: ExportOptions) -> str:
        return page.normalized_text if options.transcription == "normalized" else page.reviewed_text

    @abstractmethod
    def export(self, project: Project, options: ExportOptions, destination: Path) -> Path: ...

