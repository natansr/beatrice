from html import escape
from pathlib import Path
from app.exporters.base import BaseExporter


class HtmlExporter(BaseExporter):
    format_name, extension = "html", ".html"

    def export(self, project, options, destination: Path):
        header = f"<header><h1>{escape(project.title)}</h1><p>{escape(project.author)}</p></header>" if options.include_metadata else ""
        sections = []
        for page in self.pages(project, options):
            title = f"<h2>Página {page.page_number}</h2>" if options.include_page_numbers else ""
            paragraphs = "".join(f"<p>{escape(p)}</p>" for p in self.text(page, options).split("\n\n"))
            sections.append(f'<section data-page="{page.page_number}">{title}{paragraphs}</section>')
        html = f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{escape(project.title)}</title></head><body><article>{header}{"".join(sections)}</article></body></html>'
        destination.write_text(html, encoding="utf-8")
        return destination

