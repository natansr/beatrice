from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer
from xml.sax.saxutils import escape
from app.exporters.base import BaseExporter


class PdfExporter(BaseExporter):
    format_name, extension = "pdf", ".pdf"

    def export(self, project, options, destination: Path):
        doc = SimpleDocTemplate(str(destination), pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        styles, story = getSampleStyleSheet(), []
        if options.include_metadata or options.add_title_page:
            story += [Paragraph(escape(project.title), styles["Title"]), Paragraph(escape(project.author), styles["Normal"])]
            if options.add_title_page: story.append(PageBreak())
        pages = self.pages(project, options)
        for index, page in enumerate(pages):
            if options.include_page_numbers: story.append(Paragraph(f"Página {page.page_number}", styles["Heading2"]))
            for paragraph in self.text(page, options).split("\n\n"):
                story += [Paragraph(escape(paragraph).replace("\n", "<br/>"), styles["BodyText"]), Spacer(1, 8)]
            if options.preserve_page_boundaries and index < len(pages)-1: story.append(PageBreak())
        doc.build(story)
        return destination

