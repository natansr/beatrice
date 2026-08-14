const input=document.querySelector('#files'), previews=document.querySelector('#previews');
input?.addEventListener('change',()=>{previews.innerHTML='';[...input.files].forEach(file=>{const img=document.createElement('img');img.alt=file.name;img.src=URL.createObjectURL(file);previews.append(img)})});
document.querySelector('#upload-form')?.addEventListener('submit',async event=>{event.preventDefault();const status=document.querySelector('#upload-status');status.textContent='Enviando…';const response=await fetch(`/api/projects/${window.BEATRICE_PROJECT_ID}/pages`,{method:'POST',body:new FormData(event.target)});if(response.ok)location.reload();else{const body=await response.json();status.textContent=body.detail||'Falha no envio.'}});

