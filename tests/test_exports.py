import json
from pathlib import Path
import pytest
from docx import Document
from pypdf import PdfReader
from app.database import SessionLocal
from app.models import Page, PageStatus
from app.schemas.export import ExportOptions
from app.services.export_service import export_project
from app.services.project_service import get_project

@pytest.mark.parametrize("format,extension",[("txt",".txt"),("md",".md"),("html",".html"),("docx",".docx"),("pdf",".pdf"),("json",".json")])
def test_exports(project,tmp_path,format,extension):
    with SessionLocal() as db:
        db.add(Page(project_id=project["id"],page_number=112,original_filename="page.png",original_image_path="unused",raw_ocr_text="sobre",reviewed_text="sôbre êste texto",status=PageStatus.REVIEWED));db.commit()
        result=export_project(get_project(db,project["id"]),ExportOptions(format=format,include_metadata=True),tmp_path)
        assert result.suffix==extension and result.stat().st_size>0
        if format=="txt": assert "sôbre" in result.read_text()
        if format=="json": assert json.loads(result.read_text())["software"]=="BEATRICE"
        if format=="docx": assert "sôbre" in "\n".join(p.text for p in Document(result).paragraphs)
        if format=="pdf": assert "texto" in "".join(p.extract_text() or "" for p in PdfReader(result).pages)

