from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "BEATRICE"
    environment: str = Field("development", validation_alias=AliasChoices("BEATRICE_ENV", "BEATRICE_ENVIRONMENT"))
    database_url: str = Field("sqlite:///./beatrice.db", validation_alias=AliasChoices("DATABASE_URL", "BEATRICE_DATABASE_URL"))
    data_dir: Path = Field(Path("./data"), validation_alias=AliasChoices("DATA_DIR", "BEATRICE_DATA_DIR"))
    tesseract_cmd: str = Field("", validation_alias=AliasChoices("TESSERACT_CMD", "BEATRICE_TESSERACT_CMD"))
    max_upload_size_mb: int = Field(25, validation_alias=AliasChoices("MAX_UPLOAD_SIZE_MB", "BEATRICE_MAX_UPLOAD_SIZE_MB"))

    model_config = SettingsConfigDict(env_file=".env", env_prefix="BEATRICE_", extra="ignore")

    @property
    def projects_dir(self) -> Path:
        return self.data_dir / "projects"


@lru_cache
def get_settings() -> Settings:
    return Settings()
