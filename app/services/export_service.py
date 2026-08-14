import re
from pathlib import Path
from app.exporters import EXPORTERS
from app.models import Project
from app.schemas.export import ExportOptions


def export_project(project: Project, options: ExportOptions, project_dir: Path) -> Path:
    exporter_class = EXPORTERS[options.format]
    exports = project_dir / "exports"
    exports.mkdir(parents=True, exist_ok=True)
    safe_title = re.sub(r"[^a-zA-Z0-9_-]+", "_", project.title).strip("_")[:80] or "project"
    destination = exports / f"{safe_title}{exporter_class.extension}"
    return exporter_class().export(project, options, destination)

