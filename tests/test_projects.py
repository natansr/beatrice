def test_create_and_edit_project(client,project):
    assert project["title"]=="A Idade Média"
    response=client.put(f"/api/projects/{project['id']}",json={"title":"Título revisto","author":"Ivan Lins","description":"Obra","language":"pt-BR","transcription_mode":"diplomatic","include_handwritten_notes":False})
    assert response.status_code==200 and response.json()["title"]=="Título revisto"

