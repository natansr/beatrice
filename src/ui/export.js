import { createExport, downloadBlob } from '../services/export-service.js'
import { projectWithPages } from '../services/project-service.js'
import { escapeHtml, shell, toast } from './components.js'
import { navigate } from '../router.js'
import { t } from '../i18n.js'

export async function renderExport(root, projectId) {
  const project = await projectWithPages(projectId); if (!project) return navigate('/')
  root.innerHTML = shell(`<section class="export-page"><a href="#/project/${project.id}">← ${t('backProject')}</a><h1>${t('exportProject')}</h1><p>${escapeHtml(project.title)}</p><aside class="help-note">${t('exportHelp')}</aside><form id="export-form" class="export-card"><fieldset><legend>${t('format')}</legend><div class="format-grid">${[['txt','TXT'],['docx','Word (DOCX)'],['pdf','PDF'],['md','Markdown'],['html','HTML'],['json','JSON']].map(([value,label], index) => `<label><input type="radio" name="format" value="${value}" ${index ? '' : 'checked'}> ${label}</label>`).join('')}</div></fieldset><label>${t('transcription')}<select name="transcription"><option value="diplomatic">${t('diplomaticReviewed')}</option><option value="normalized">${t('normalized')}</option></select></label>${[['includePageNumbers',t('includePageNumbers'),1],['preserveBoundaries',t('preserveBoundaries'),1],['includeUnreviewed',t('includeUnreviewed'),0],['includeMetadata',t('includeMetadata'),0],['titlePage',t('titlePage'),0]].map(([name,label,checked]) => `<label class="check"><input type="checkbox" name="${name}" ${checked ? 'checked' : ''}> ${label}</label>`).join('')}<button class="primary">${t('generateDownload')}</button><p id="export-state"></p></form></section>`)
  root.querySelector('#export-form').onsubmit = async event => {
    event.preventDefault(); const data = new FormData(event.target), options = { format: data.get('format'), transcription: data.get('transcription') }
    for (const key of ['includePageNumbers','preserveBoundaries','includeUnreviewed','includeMetadata','titlePage']) options[key] = data.has(key)
    const state = root.querySelector('#export-state'); state.textContent = t('generating')
    try { const result = await createExport(project, options), safe = project.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'beatrice'; downloadBlob(result.blob, `${safe}.${result.extension}`); state.textContent = t('exportDone') } catch (error) { toast(error.message, 'error'); state.textContent = t('exportFailed') }
  }
}
