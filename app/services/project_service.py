from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import PageStatus, Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def list_projects(db: Session) -> list[Project]:
    return list(db.scalars(select(Project).order_by(Project.updated_at.desc())))


def get_project(db: Session, project_id: str) -> Project | None:
    return db.get(Project, project_id)


def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project: Project, data: ProjectUpdate) -> Project:
    for key, value in data.model_dump().items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()


def project_stats(project: Project) -> dict:
    pages = project.pages
    return {
        "total": len(pages),
        "processed": sum(bool(p.processed_image_path) for p in pages),
        "transcribed": sum(bool(p.raw_ocr_text) for p in pages),
        "reviewed": sum(p.status == PageStatus.REVIEWED for p in pages),
        "needs_review": sum(p.status == PageStatus.NEEDS_REVIEW for p in pages),
    }


def missing_page_numbers(project: Project) -> list[int]:
    numbers = sorted({p.page_number for p in project.pages})
    if len(numbers) < 2:
        return []
    return [n for n in range(numbers[0], numbers[-1] + 1) if n not in numbers]

