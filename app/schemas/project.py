from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    author: str = Field(default="", max_length=300)
    description: str = ""
    language: str = "pt-BR"
    transcription_mode: str = "diplomatic"
    include_handwritten_notes: bool = False


class ProjectUpdate(ProjectCreate):
    pass


class ProjectRead(ProjectCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str

