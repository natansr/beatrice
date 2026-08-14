import os
os.environ["BEATRICE_DATABASE_URL"] = "sqlite:///./test_beatrice.db"
os.environ["BEATRICE_DATA_DIR"] = "./test_data"

import pytest
from fastapi.testclient import TestClient
from app.database import Base, engine
from app.main import app

@pytest.fixture(autouse=True)
def database():
    Base.metadata.drop_all(engine); Base.metadata.create_all(engine); yield

@pytest.fixture
def client():
    with TestClient(app) as value: yield value

@pytest.fixture
def project(client):
    return client.post("/api/projects",json={"title":"A Idade Média","author":"Ivan Lins","language":"pt-BR","transcription_mode":"diplomatic"}).json()

