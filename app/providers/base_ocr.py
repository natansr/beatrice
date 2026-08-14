from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass
class OCRBlock:
    text: str
    confidence: float
    bounding_box: dict[str, int]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class OCRResult:
    full_text: str
    mean_confidence: float | None
    blocks: list[OCRBlock]


class BaseOCRProvider(ABC):
    @abstractmethod
    def transcribe(self, image_path: Path, language: str = "por") -> OCRResult:
        raise NotImplementedError

