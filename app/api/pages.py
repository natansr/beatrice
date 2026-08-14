import logging
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.config import get_settings
from app.database import get_db
from app.models import Page, PageStatus
from app.schemas.page import PageRead, PageUpdate
from app.services import image_service, ocr_service, page_service, project_service

router = APIRouter(tags=["pages"]); log = logging.getLogger(__name__)

def required(db, page_id):
    page = db.get(Page, page_id)
    if not page: raise HTTPException(404, "Page not found.")
    return page

@router.get("/api/projects/{project_id}/pages", response_model=list[PageRead])
def list_all(project_id: str, db: Session = Depends(get_db)): return page_service.list_pages(db, project_id)

@router.post("/api/projects/{project_id}/pages", response_model=list[PageRead], status_code=201)
async def upload(project_id: str, files: list[UploadFile] = File(...), start_page: int | None = Form(None), db: Session = Depends(get_db)):
    project = project_service.get_project(db, project_id)
    if not project: raise HTTPException(404, "Project not found.")
    settings = get_settings(); created = []
    for index, upload_file in enumerate(sorted(files, key=lambda f: f.filename or "")):
        try:
            path, original_name = await image_service.store_upload(upload_file, settings.projects_dir/project.id, settings.max_upload_size_mb*1024*1024)
        except ValueError as exc: raise HTTPException(400, str(exc)) from exc
        fallback = (start_page or 1) + index
        page = Page(project_id=project.id, page_number=image_service.infer_page_number(original_name, fallback), original_filename=original_name, original_image_path=str(path))
        db.add(page); created.append(page)
    db.commit()
    for page in created: db.refresh(page)
    log.info("Uploaded %s page(s) to project %s", len(created), project.id)
    return created

@router.get("/api/pages/{page_id}", response_model=PageRead)
def get_one(page_id: str, db: Session = Depends(get_db)): return required(db, page_id)

@router.put("/api/pages/{page_id}", response_model=PageRead)
def update(page_id: str, data: PageUpdate, db: Session = Depends(get_db)):
    try: return page_service.update_page(db, required(db, page_id), data)
    except ValueError as exc: raise HTTPException(422, str(exc)) from exc

@router.delete("/api/pages/{page_id}", status_code=204)
def delete(page_id: str, db: Session = Depends(get_db)):
    for path in page_service.delete_page(db, required(db, page_id)):
        path.unlink(missing_ok=True)

@router.post("/api/pages/{page_id}/process", response_model=PageRead)
def process(page_id: str, db: Session = Depends(get_db)):
    page = required(db, page_id); destination = get_settings().projects_dir/page.project_id/"processed"/f"{page.id}.png"
    try: image_service.process_image(Path(page.original_image_path), destination)
    except Exception as exc:
        log.exception("Image processing failed for %s", page.id); page.status=PageStatus.ERROR; db.commit(); raise HTTPException(422, "Unable to process this image.") from exc
    page.processed_image_path=str(destination); page.status=PageStatus.PENDING; db.commit(); db.refresh(page); return page

@router.post("/api/pages/{page_id}/ocr", response_model=PageRead)
def ocr(page_id: str, db: Session = Depends(get_db)):
    try: return ocr_service.run_ocr(db, required(db, page_id))
    except Exception as exc:
        log.exception("OCR failed for %s", page_id); raise HTTPException(422, "Could not run OCR. Check Tesseract and language data.") from exc

@router.post("/api/pages/{page_id}/mark-reviewed", response_model=PageRead)
def mark_reviewed(page_id: str, db: Session = Depends(get_db)):
    page=required(db,page_id); page_service.save_revision(db,page,"marked_reviewed"); page.status=PageStatus.REVIEWED; db.commit(); db.refresh(page); return page

@router.post("/api/pages/{page_id}/mark-needs-review", response_model=PageRead)
def mark_needs_review(page_id: str, db: Session = Depends(get_db)):
    page=required(db,page_id); page.status=PageStatus.NEEDS_REVIEW; db.commit(); db.refresh(page); return page

