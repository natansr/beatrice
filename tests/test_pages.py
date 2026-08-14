from io import BytesIO
from PIL import Image
from app.database import SessionLocal
from app.services.project_service import get_project, missing_page_numbers

def image_bytes():
    stream=BytesIO(); Image.new("RGB",(50,80),"white").save(stream,"PNG"); return stream.getvalue()

def test_upload_sort_number_update_missing_and_status(client,project):
    files=[("files",("page_12.png",image_bytes(),"image/png")),("files",("page_10.png",image_bytes(),"image/png"))]
    response=client.post(f"/api/projects/{project['id']}/pages",files=files)
    assert response.status_code==201
    pages=client.get(f"/api/projects/{project['id']}/pages").json()
    assert [p["page_number"] for p in pages]==[10,12]
    with SessionLocal() as db: assert missing_page_numbers(get_project(db,project["id"]))==[11]
    page=pages[0]
    updated=client.put(f"/api/pages/{page['id']}",json={"page_number":11,"reviewed_text":"sôbre êste texto"}).json()
    assert updated["page_number"]==11 and updated["reviewed_text"].startswith("sôbre")
    assert client.post(f"/api/pages/{page['id']}/mark-reviewed").json()["status"]=="reviewed"

def test_rejects_fake_image(client,project):
    response=client.post(f"/api/projects/{project['id']}/pages",files={"files":("bad.png",b"not image","image/png")})
    assert response.status_code==400

