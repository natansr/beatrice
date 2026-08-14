import json
from pathlib import Path
from app.exporters.base import BaseExporter


class JsonExporter(BaseExporter):
    format_name, extension = "json", ".json"

    def export(self, project, options, destination: Path):
        data = {"software": "BEATRICE", "title": project.title, "author": project.author,
                "language": project.language, "transcription_mode": options.transcription,
                "pages": [{"page_number": p.page_number, "status": p.status.value,
                           "ocr_text": p.raw_ocr_text, "reviewed_text": p.reviewed_text,
                           "normalized_text": p.normalized_text} for p in self.pages(project, options)]}
        destination.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        return destination

