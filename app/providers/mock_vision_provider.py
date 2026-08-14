from pathlib import Path
from app.providers.base_vision import BaseVisionProvider


class MockVisionProvider(BaseVisionProvider):
    def transcribe(self, original: Path, processed: Path | None, ocr_text: str) -> str:
        return ocr_text

