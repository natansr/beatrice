from pydantic import BaseModel, ConfigDict


class PageUpdate(BaseModel):
    page_number: int | None = None
    reviewed_text: str | None = None
    normalized_text: str | None = None
    notes: str | None = None
    status: str | None = None


class PageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    project_id: str
    page_number: int
    original_filename: str
    raw_ocr_text: str
    reviewed_text: str
    normalized_text: str
    status: str
    ocr_confidence: float | None

