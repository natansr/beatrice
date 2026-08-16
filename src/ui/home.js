import { listProjects, saveProject } from '../services/database.js'
import { newProject } from '../services/project-service.js'
import { escapeHtml, field, modal, shell, toast } from './components.js'
import { navigate } from '../router.js'
import { t } from '../i18n.js'

export async function renderHome(root) {
  const projects = await listProjects()
  root.innerHTML = shell(`<section class="hero"><div><h1>${t('projects')}</h1></div><button class="primary" id="new-project">${t('newProject')}</button></section>
  <section class="project-grid">${projects.map(project => `<a class="project-card" href="#/project/${project.id}"><span class="dot"></span><h2>${escapeHtml(project.title)}</h2><p>${escapeHtml(project.author || t('authorMissing'))}</p><small>${t('updated')} ${new Date(project.updatedAt).toLocaleDateString(t('localeCode'))}</small></a>`).join('') || `<div class="empty"><p>${t('noProjects')}</p></div>`}</section>
  ${modal('project-modal', t('newProject'), `<form id="project-form" class="form-grid">${field(t('title'), 'title')}${field(t('author'), 'author')}<label>${t('documentLanguage')}<select name="language"><option value="por">${t('portuguese')}</option><option value="eng">${t('english')}</option></select></label><label>${t('transcriptionType')}<select name="transcriptionMode"><option value="diplomatic">${t('diplomatic')}</option><option value="normalized">${t('normalized')}</option></select></label><label class="wide">${t('description')}<textarea name="description"></textarea></label><label class="check wide"><input type="checkbox" name="includeHandwrittenNotes"> ${t('handwritten')}</label><button class="primary wide">${t('createProject')}</button></form>`)}`)
  const dialog = root.querySelector('#project-modal')
  root.querySelector('#new-project').onclick = () => dialog.showModal()
  root.querySelector('#project-form').onsubmit = async event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); data.includeHandwrittenNotes = Boolean(data.includeHandwrittenNotes)
    try { const project = newProject(data); await saveProject(project); dialog.close(); navigate(`/project/${project.id}`) } catch (error) { toast(error.message, 'error') }
  }
}
