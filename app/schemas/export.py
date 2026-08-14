from typing import Literal
from pydantic import BaseModel


class ExportOptions(BaseModel):
    format: Literal["txt", "md", "html", "docx", "pdf", "json"] = "txt"
    transcription: Literal["diplomatic", "normalized"] = "diplomatic"
    include_page_numbers: bool = True
    preserve_page_boundaries: bool = True
    include_unreviewed_pages: bool = False
    include_metadata: bool = False
    add_title_page: bool = False
    include_missing_page_markers: bool = False
    include_handwritten_annotations: bool = False

