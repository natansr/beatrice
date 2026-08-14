from app.exporters.docx_exporter import DocxExporter
from app.exporters.html_exporter import HtmlExporter
from app.exporters.json_exporter import JsonExporter
from app.exporters.markdown_exporter import MarkdownExporter
from app.exporters.pdf_exporter import PdfExporter
from app.exporters.txt_exporter import TxtExporter

EXPORTERS = {e.format_name: e for e in (TxtExporter, MarkdownExporter, HtmlExporter, DocxExporter, PdfExporter, JsonExporter)}

