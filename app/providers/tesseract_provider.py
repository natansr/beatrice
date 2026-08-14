from pathlib import Path

import pytesseract
from PIL import Image
from pytesseract import Output

from app.providers.base_ocr import BaseOCRProvider, OCRBlock, OCRResult


class TesseractOCRProvider(BaseOCRProvider):
    def __init__(self, command: str = ""):
        if command:
            pytesseract.pytesseract.tesseract_cmd = command

    def transcribe(self, image_path: Path, language: str = "por") -> OCRResult:
        with Image.open(image_path) as image:
            data = pytesseract.image_to_data(image, lang=language, output_type=Output.DICT)
            text = pytesseract.image_to_string(image, lang=language)
        blocks, confidences = [], []
        for i, word in enumerate(data["text"]):
            word = word.strip()
            confidence = float(data["conf"][i])
            if word and confidence >= 0:
                confidences.append(confidence)
                blocks.append(OCRBlock(word, confidence, {
                    "x": data["left"][i], "y": data["top"][i],
                    "width": data["width"][i], "height": data["height"][i],
                }))
        mean = sum(confidences) / len(confidences) if confidences else None
        return OCRResult(text, mean, blocks)

