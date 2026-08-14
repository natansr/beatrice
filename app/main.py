import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import Depends, FastAPI, Form, HTTPException, Request
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.api import exports, pages, projects, settings
from app.config import get_settings
from app.database import Base, engine, get_db
from app.models import Page
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services import project_service

logging.basicConfig(level=logging.INFO,format="%(asctime)s %(levelname)s %(name)s %(message)s")
config=get_settings(); templates=Jinja2Templates(directory=Path(__file__).parent/"templates")

@asynccontextmanager
async def lifespan(app):
    config.projects_dir.mkdir(parents=True,exist_ok=True); Base.metadata.create_all(engine); yield

app=FastAPI(title="BEATRICE",description="Book Extraction And Transcription with Review, Image Correction and Export",lifespan=lifespan)
app.mount("/static",StaticFiles(directory=Path(__file__).parent/"static"),name="static")
for router in (projects.router,pages.router,exports.router,settings.router): app.include_router(router)

@app.get("/")
def index(request:Request,db:Session=Depends(get_db)):
    items=[(p,project_service.project_stats(p)) for p in project_service.list_projects(db)]
    return templates.TemplateResponse(request,"index.html",{"items":items})

@app.post("/projects")
def create_project(title:str=Form(...),author:str=Form(""),description:str=Form(""),language:str=Form("pt-BR"),transcription_mode:str=Form("diplomatic"),include_handwritten_notes:bool=Form(False),db:Session=Depends(get_db)):
    project=project_service.create_project(db,ProjectCreate(title=title,author=author,description=description,language=language,transcription_mode=transcription_mode,include_handwritten_notes=include_handwritten_notes))
    return RedirectResponse(f"/projects/{project.id}",303)

@app.get("/projects/{project_id}")
def project_detail(project_id:str,request:Request,db:Session=Depends(get_db)):
    project=project_service.get_project(db,project_id)
    if not project: raise HTTPException(404,"Project not found")
    return templates.TemplateResponse(request,"project_detail.html",{"project":project,"stats":project_service.project_stats(project),"missing":project_service.missing_page_numbers(project)})

@app.post("/projects/{project_id}/edit")
def edit_project(project_id:str,title:str=Form(...),author:str=Form(""),description:str=Form(""),language:str=Form("pt-BR"),transcription_mode:str=Form("diplomatic"),include_handwritten_notes:bool=Form(False),db:Session=Depends(get_db)):
    project=project_service.get_project(db,project_id)
    if not project: raise HTTPException(404,"Project not found")
    project_service.update_project(db,project,ProjectUpdate(title=title,author=author,description=description,language=language,transcription_mode=transcription_mode,include_handwritten_notes=include_handwritten_notes))
    return RedirectResponse(f"/projects/{project.id}",303)

@app.post("/projects/{project_id}/delete")
def delete_project_view(project_id:str,db:Session=Depends(get_db)):
    project=project_service.get_project(db,project_id)
    if not project: raise HTTPException(404,"Project not found")
    project_service.delete_project(db,project)
    return RedirectResponse("/",303)

@app.get("/projects/{project_id}/export")
def export_view(project_id:str,request:Request,db:Session=Depends(get_db)):
    project=project_service.get_project(db,project_id)
    if not project: raise HTTPException(404,"Project not found")
    return templates.TemplateResponse(request,"export.html",{"project":project})

@app.get("/pages/{page_id}/review")
def page_review(page_id:str,request:Request,db:Session=Depends(get_db)):
    page=db.get(Page,page_id)
    if not page: raise HTTPException(404,"Page not found")
    ordered=sorted(page.project.pages,key=lambda p:p.page_number); idx=ordered.index(page)
    return templates.TemplateResponse(request,"page_review.html",{"page":page,"previous":ordered[idx-1] if idx else None,"next":ordered[idx+1] if idx+1<len(ordered) else None})

@app.get("/images/{page_id}/{variant}")
def image(page_id:str,variant:str,db:Session=Depends(get_db)):
    page=db.get(Page,page_id)
    if not page: raise HTTPException(404)
    path=page.processed_image_path if variant=="processed" else page.original_image_path
    if not path or not Path(path).is_file(): raise HTTPException(404)
    return FileResponse(path)
