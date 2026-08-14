import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class PageStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PENDING = "pending"
    PROCESSING = "processing"
    TRANSCRIBED = "transcribed"
    NEEDS_REVIEW = "needs_review"
    REVIEWED = "reviewed"
    ERROR = "error"


class Page(Base):
    __tablename__ = "pages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    page_number: Mapped[int] = mapped_column(Integer, index=True)
    original_filename: Mapped[str] = mapped_column(String(500))
    original_image_path: Mapped[str] = mapped_column(String(1000))
    processed_image_path: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    raw_ocr_text: Mapped[str] = mapped_column(Text, default="")
    reviewed_text: Mapped[str] = mapped_column(Text, default="")
    normalized_text: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[PageStatus] = mapped_column(Enum(PageStatus), default=PageStatus.UPLOADED)
    ocr_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    ocr_blocks: Mapped[list] = mapped_column(JSON, default=list)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    project = relationship("Project", back_populates="pages")
    revisions = relationship("PageRevision", back_populates="page", cascade="all, delete-orphan")

