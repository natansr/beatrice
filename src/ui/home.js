import { listProjects, saveProject } from '../services/database.js'
import { newProject } from '../services/project-service.js'
import { escapeHtml, field, modal, shell, toast } from './components.js'
import { navigate } from '../router.js'
import { t } from '../i18n.js'

export async function renderHome(root) {
  const projects = await listProjects()
  root.innerHTML = shell(`<section class="hero"><div><h1>${t('projects')}</h1></div><button class="primary" id="new-project">${t('newProject')}</button></section>
  <details class="getting-started" ${projects.length ? '' : 'open'}><summary>${t('beginnerTitle')}</summary><p>${t('beginnerFlow')}</p><p><strong>OCR:</strong> ${t('ocrMeaning')}</p><p>${t('localMeaning')}</p></details><section class="project-grid">${projects.map(project => `<a class="project-card" href="#/project/${project.id}"><span class="dot"></span><h2>${escapeHtml(project.title)}</h2><p>${escapeHtml(project.author || t('authorMissing'))}</p><small>${t('updated')} ${new Date(project.updatedAt).toLocaleDateString(t('localeCode'))}</small></a>`).join('') || `<div class="empty"><h2>${t('startTranscription')}</h2><p>${t('startHint')}</p></div>`}</section>
  ${modal('project-modal', t('newProject'), `<form id="project-form" class="form-grid">${field(t('title'), 'title')}${field(t('author'), 'author')}<label>${t('ocrLanguage')}<select name="language"><option value="por">${t('portuguese')}</option><option value="eng">${t('english')}</option></select><small>${t('ocrLanguageHelp')}</small></label><label>${t('mode')}<select name="transcriptionMode"><option value="diplomatic">${t('diplomatic')}</option><option value="normalized">${t('normalized')}</option></select><small>${t('modeHelp')}</small></label><label class="wide">${t('description')}<textarea name="description"></textarea></label><label class="check wide"><input type="checkbox" name="includeHandwrittenNotes"> ${t('handwritten')}</label><button class="primary wide">${t('createProject')}</button></form>`)}`)
  const dialog = root.querySelector('#project-modal')
  root.querySelector('#new-project').onclick = () => dialog.showModal()
  root.querySelector('#project-form').onsubmit = async event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); data.includeHandwrittenNotes = Boolean(data.includeHandwrittenNotes)
    try { const project = newProject(data); await saveProject(project); dialog.close(); navigate(`/project/${project.id}`) } catch (error) { toast(error.message, 'error') }
  }
}
