from pathlib import Path
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Page, PageRevision, PageStatus, Project
from app.schemas.page import PageUpdate


def list_pages(db: Session, project_id: str) -> list[Page]:
    return list(db.scalars(select(Page).where(Page.project_id == project_id).order_by(Page.page_number)))


def update_page(db: Session, page: Page, data: PageUpdate) -> Page:
    values = data.model_dump(exclude_none=True)
    if "status" in values:
        values["status"] = PageStatus(values["status"])
    for key, value in values.items():
        setattr(page, key, value)
    db.commit(); db.refresh(page)
    return page


def save_revision(db: Session, page: Page, reason: str) -> None:
    if page.reviewed_text:
        db.add(PageRevision(page_id=page.id, text=page.reviewed_text, reason=reason))


def delete_page(db: Session, page: Page) -> list[Path]:
    paths = [Path(p) for p in (page.original_image_path, page.processed_image_path) if p]
    db.delete(page); db.commit()
    return paths

