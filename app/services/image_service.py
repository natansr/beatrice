import re
import uuid
from pathlib import Path

import cv2
import numpy as np
from fastapi import UploadFile
from PIL import Image

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}
ALLOWED_FORMATS = {"JPEG", "PNG", "TIFF", "WEBP"}


def infer_page_number(filename: str, fallback: int) -> int:
    matches = re.findall(r"\d+", Path(filename).stem)
    return int(matches[-1]) if matches else fallback


async def store_upload(upload: UploadFile, project_dir: Path, max_bytes: int) -> tuple[Path, str]:
    extension = Path(upload.filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported image extension.")
    content = await upload.read(max_bytes + 1)
    if len(content) > max_bytes:
        raise ValueError("Image exceeds the upload size limit.")
    try:
        from io import BytesIO
        with Image.open(BytesIO(content)) as image:
            if image.format not in ALLOWED_FORMATS:
                raise ValueError("Uploaded file is not a supported image.")
            image.verify()
    except (OSError, SyntaxError):
        raise ValueError("Uploaded file is not a valid image.")
    originals = project_dir / "originals"
    originals.mkdir(parents=True, exist_ok=True)
    destination = originals / f"{uuid.uuid4().hex}{extension}"
    destination.write_bytes(content)
    return destination, upload.filename or "image"


def process_image(source: Path, destination: Path, options: dict | None = None) -> Path:
    options = options or {}
    image = cv2.imread(str(source))
    if image is None:
        raise ValueError("Unable to read image.")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    if options.get("denoise", True):
        gray = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    if options.get("contrast", True):
        gray = cv2.createCLAHE(2.0, (8, 8)).apply(gray)
    if options.get("adaptive_threshold", True):
        gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 15)
    if options.get("sharpen", False):
        gray = cv2.filter2D(gray, -1, np.array([[0,-1,0],[-1,5,-1],[0,-1,0]]))
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(destination), gray):
        raise ValueError("Unable to write processed image.")
    return destination


def rotate_original(source: Path, destination: Path, degrees: int) -> Path:
    with Image.open(source) as image:
        image.rotate(-degrees, expand=True).save(destination)
    return destination

