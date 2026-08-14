from pathlib import Path
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import Page, PageStatus
from app.providers.tesseract_provider import TesseractOCRProvider
from app.services.page_service import save_revision


def run_ocr(db: Session, page: Page, provider=None) -> Page:
    save_revision(db, page, "before_ocr")
    page.status = PageStatus.PROCESSING
    db.commit()
    provider = provider or TesseractOCRProvider(get_settings().tesseract_cmd)
    source = Path(page.processed_image_path or page.original_image_path)
    result = provider.transcribe(source, "por")
    page.raw_ocr_text = result.full_text
    if not page.reviewed_text:
        page.reviewed_text = result.full_text
    page.ocr_confidence = result.mean_confidence
    page.ocr_blocks = [block.to_dict() for block in result.blocks]
    page.status = PageStatus.NEEDS_REVIEW
    db.commit(); db.refresh(page)
    return page

