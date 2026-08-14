from fastapi import APIRouter
from app.config import get_settings
router=APIRouter(prefix="/api/settings",tags=["settings"])
@router.get("")
def settings():
    config=get_settings(); return {"environment":config.environment,"max_upload_size_mb":config.max_upload_size_mb,"tesseract_configured":bool(config.tesseract_cmd)}

