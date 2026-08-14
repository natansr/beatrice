from abc import ABC, abstractmethod
from pathlib import Path


VISION_TRANSCRIPTION_PROMPT = """Transcribe this page diplomatically and faithfully.
Do not modernize spelling or correct grammar. Preserve original accents, punctuation,
capitalization, quotations, footnotes, numbers and historical orthography. Never invent
or complete unclear text; flag it for human review. The image is the source of truth."""


class BaseVisionProvider(ABC):
    @abstractmethod
    def transcribe(self, original: Path, processed: Path | None, ocr_text: str) -> str:
        raise NotImplementedError

