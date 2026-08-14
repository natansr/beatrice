import { getProject, removePage, removeProject, savePage, saveProject } from '../services/database.js'
import { createPage, inferPageNumber, validateImage } from '../services/image-service.js'
import { missingPageNumbers, projectStats, projectWithPages, touchProject } from '../services/project-service.js'
import { escapeHtml, field, modal, shell, statusLabel, toast } from './components.js'
import { navigate } from '../router.js'
import { t } from '../i18n.js'

export async function renderProject(root, projectId) {
  const project = await projectWithPages(projectId)
  if (!project) return navigate('/')
  const stats = projectStats(project.pages), missing = missingPageNumbers(project.pages)
  root.innerHTML = shell(`<nav class="crumb"><a href="#/">${t('projects')}</a> / ${escapeHtml(project.title)}</nav>
    <section class="project-heading"><div><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.author)}</p></div><div class="actions"><button id="edit-project">${t('edit')}</button><button id="delete-project" class="danger">${t('delete')}</button><a class="button" href="#/project/${project.id}/export">${t('export')}</a><button id="add-pages" class="primary">${t('addPages')}</button></div></section>
    <section class="metrics">${[[t('pages'), stats.total], [t('processed'), stats.processed], [t('withOcr'), stats.transcribed], [t('reviewed'), stats.reviewed], [t('toReview'), stats.needsReview]].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</section>
    ${missing.length ? `<aside class="warning"><strong>${t('missingPages')}</strong> ${missing.join(', ')}. ${t('noPlaceholder')}</aside>` : ''}
    <aside class="help-note"><strong>OCR:</strong> ${t('ocrMeaning')}</aside><section class="page-list"><header><h2>${t('pages')}</h2><span>${t('reviewedCount', { reviewed: stats.reviewed, total: stats.total })}</span></header>${project.pages.map(page => `<div class="page-row"><a href="#/project/${project.id}/page/${page.id}"><strong>${page.pageNumber}</strong><span>${escapeHtml(page.originalFilename)}</span><em class="status ${page.status}">${statusLabel(page.status)}</em></a><button class="icon delete-page" data-id="${page.id}" aria-label="${t('delete')} ${t('page')} ${page.pageNumber}">×</button></div>`).join('') || `<div class="empty small">${t('noPages')}</div>`}</section>
    ${modal('upload-modal', t('addPages'), `<form id="upload-form"><label class="upload-zone"><strong>${t('chooseImages')}</strong><span>${t('imageHelp')}</span><input id="page-files" type="file" accept="image/jpeg,image/png,image/tiff,image/webp" multiple required></label><div id="previews" class="previews"></div>${field(t('fallbackPage'), 'startPage', '1', 'number')}<button class="primary wide">${t('importPages')}</button></form>`)}
    ${modal('edit-modal', t('editProject'), `<form id="edit-form" class="form-grid">${field(t('title'), 'title', project.title)}${field(t('author'), 'author', project.author)}<label>${t('ocrLanguage')}<select name="language"><option value="por" ${project.language === 'por' ? 'selected' : ''}>${t('portuguese')}</option><option value="eng" ${project.language === 'eng' ? 'selected' : ''}>${t('english')}</option></select><small>${t('ocrLanguageHelp')}</small></label><label>${t('mode')}<select name="transcriptionMode"><option value="diplomatic" ${project.transcriptionMode === 'diplomatic' ? 'selected' : ''}>${t('diplomatic')}</option><option value="normalized" ${project.transcriptionMode === 'normalized' ? 'selected' : ''}>${t('normalized')}</option></select><small>${t('modeHelp')}</small></label><label class="wide">${t('description')}<textarea name="description">${escapeHtml(project.description)}</textarea></label><label class="check wide"><input type="checkbox" name="includeHandwrittenNotes" ${project.includeHandwrittenNotes ? 'checked' : ''}> ${t('handwritten')}</label><button class="primary wide">${t('save')}</button></form>`)}`)

  const uploadDialog = root.querySelector('#upload-modal'), filesInput = root.querySelector('#page-files')
  root.querySelector('#add-pages').onclick = () => uploadDialog.showModal()
  root.querySelector('#edit-project').onclick = () => root.querySelector('#edit-modal').showModal()
  filesInput.onchange = () => { const previews = root.querySelector('#previews'); previews.innerHTML = ''; [...filesInput.files].forEach(file => { const img = new Image(); img.src = URL.createObjectURL(file); img.alt = file.name; img.onload = () => URL.revokeObjectURL(img.src); previews.append(img) }) }
  root.querySelector('#upload-form').onsubmit = async event => {
    event.preventDefault(); const files = [...filesInput.files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })), start = Number(new FormData(event.target).get('startPage')) || 1
    try {
      for (const [index, file] of files.entries()) { validateImage(file); await savePage(await createPage(project.id, file, inferPageNumber(file.name, start + index))) }
      await touchProject(project.id); toast(t('imported', { count: files.length })); await renderProject(root, project.id)
    } catch (error) { toast(error.message, 'error') }
  }
  root.querySelector('#edit-form').onsubmit = async event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); Object.assign(project, data, { includeHandwrittenNotes: Boolean(data.includeHandwrittenNotes) }); delete project.pages; await saveProject(project); await renderProject(root, project.id)
  }
  root.querySelector('#delete-project').onclick = async () => { if (confirm(t('confirmProjectDelete', { title: project.title }))) { await removeProject(project.id); navigate('/') } }
  root.querySelectorAll('.delete-page').forEach(button => button.onclick = async () => { if (confirm(t('confirmPageDelete'))) { await removePage(button.dataset.id); await touchProject(project.id); await renderProject(root, project.id) } })
}
