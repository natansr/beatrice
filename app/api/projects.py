from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services import project_service

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=list[ProjectRead])
def list_all(db: Session = Depends(get_db)): return project_service.list_projects(db)

@router.post("", response_model=ProjectRead, status_code=201)
def create(data: ProjectCreate, db: Session = Depends(get_db)): return project_service.create_project(db, data)

def required(db, project_id):
    project = project_service.get_project(db, project_id)
    if not project: raise HTTPException(404, "Project not found.")
    return project

@router.get("/{project_id}", response_model=ProjectRead)
def get_one(project_id: str, db: Session = Depends(get_db)): return required(db, project_id)

@router.put("/{project_id}", response_model=ProjectRead)
def update(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db)):
    return project_service.update_project(db, required(db, project_id), data)

@router.delete("/{project_id}", status_code=204)
def delete(project_id: str, db: Session = Depends(get_db)):
    project_service.delete_project(db, required(db, project_id))

