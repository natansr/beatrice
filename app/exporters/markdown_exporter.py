from pathlib import Path
from app.exporters.base import BaseExporter


class MarkdownExporter(BaseExporter):
    format_name, extension = "md", ".md"

    def export(self, project, options, destination: Path):
        chunks = [f"# {project.title}\n\n**Autor:** {project.author}" if options.include_metadata else ""]
        for page in self.pages(project, options):
            heading = f"## Página {page.page_number}\n\n" if options.include_page_numbers else ""
            chunks.append(heading + self.text(page, options))
        destination.write_text("\n\n".join(filter(None, chunks)), encoding="utf-8")
        return destination

