import { createExport, downloadBlob } from '../services/export-service.js'
import { projectWithPages } from '../services/project-service.js'
import { escapeHtml, shell, toast } from './components.js'
import { navigate } from '../router.js'

export async function renderExport(root, projectId) {
  const project = await projectWithPages(projectId); if (!project) return navigate('/')
  root.innerHTML = shell(`<section class="export-page"><a href="#/project/${project.id}">← Voltar ao projeto</a><h1>Exportar projeto</h1><p>${escapeHtml(project.title)}</p><form id="export-form" class="export-card"><fieldset><legend>Formato</legend><div class="format-grid">${[['txt','TXT'],['docx','Word (DOCX)'],['pdf','PDF'],['md','Markdown'],['html','HTML'],['json','JSON']].map(([value,label], index) => `<label><input type="radio" name="format" value="${value}" ${index ? '' : 'checked'}> ${label}</label>`).join('')}</div></fieldset><label>Transcrição<select name="transcription"><option value="diplomatic">Diplomática (texto revisado)</option><option value="normalized">Normalizada</option></select></label>${[['includePageNumbers','Incluir números de página',1],['preserveBoundaries','Preservar limites de página',1],['includeUnreviewed','Incluir páginas não revisadas',0],['includeMetadata','Incluir metadados',0],['titlePage','Adicionar página de título',0]].map(([name,label,checked]) => `<label class="check"><input type="checkbox" name="${name}" ${checked ? 'checked' : ''}> ${label}</label>`).join('')}<button class="primary">Gerar e baixar</button><p id="export-state"></p></form></section>`)
  root.querySelector('#export-form').onsubmit = async event => {
    event.preventDefault(); const data = new FormData(event.target), options = { format: data.get('format'), transcription: data.get('transcription') }
    for (const key of ['includePageNumbers','preserveBoundaries','includeUnreviewed','includeMetadata','titlePage']) options[key] = data.has(key)
    const state = root.querySelector('#export-state'); state.textContent = 'Gerando…'
    try { const result = await createExport(project, options), safe = project.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'beatrice'; downloadBlob(result.blob, `${safe}.${result.extension}`); state.textContent = 'Exportação concluída.' } catch (error) { toast(error.message, 'error'); state.textContent = 'Falha na exportação.' }
  }
}

