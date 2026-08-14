from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.config import get_settings
from app.database import get_db
from app.schemas.export import ExportOptions
from app.services.export_service import export_project
from app.services.project_service import get_project

router=APIRouter(prefix="/api/projects",tags=["exports"])

@router.post("/{project_id}/export")
def export(project_id: str, options: ExportOptions, db: Session=Depends(get_db)):
    project=get_project(db,project_id)
    if not project: raise HTTPException(404,"Project not found.")
    try: path=export_project(project,options,get_settings().projects_dir/project.id)
    except Exception as exc: raise HTTPException(422,"Export failed.") from exc
    return FileResponse(path,filename=path.name)

