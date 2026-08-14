import { getProject, removePage, removeProject, savePage, saveProject } from '../services/database.js'
import { createPage, inferPageNumber, validateImage } from '../services/image-service.js'
import { missingPageNumbers, projectStats, projectWithPages, touchProject } from '../services/project-service.js'
import { escapeHtml, field, modal, shell, statusLabel, toast } from './components.js'
import { navigate } from '../router.js'

export async function renderProject(root, projectId) {
  const project = await projectWithPages(projectId)
  if (!project) return navigate('/')
  const stats = projectStats(project.pages), missing = missingPageNumbers(project.pages)
  root.innerHTML = shell(`<nav class="crumb"><a href="#/">Projetos</a> / ${escapeHtml(project.title)}</nav>
    <section class="project-heading"><div><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.author)}</p></div><div class="actions"><button id="edit-project">Editar</button><button id="delete-project" class="danger">Excluir</button><a class="button" href="#/project/${project.id}/export">Exportar</a><button id="add-pages" class="primary">Adicionar páginas</button></div></section>
    <section class="metrics">${[['Páginas', stats.total], ['Processadas', stats.processed], ['Com OCR', stats.transcribed], ['Revisadas', stats.reviewed], ['A revisar', stats.needsReview]].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</section>
    ${missing.length ? `<aside class="warning"><strong>Possíveis páginas ausentes:</strong> ${missing.join(', ')}. Nenhuma página fictícia foi criada.</aside>` : ''}
    <section class="page-list"><header><h2>Páginas</h2><span>${stats.reviewed} de ${stats.total} revisadas</span></header>${project.pages.map(page => `<div class="page-row"><a href="#/project/${project.id}/page/${page.id}"><strong>${page.pageNumber}</strong><span>${escapeHtml(page.originalFilename)}</span><em class="status ${page.status}">${statusLabel(page.status)}</em></a><button class="icon delete-page" data-id="${page.id}" aria-label="Excluir página ${page.pageNumber}">×</button></div>`).join('') || '<div class="empty small">Nenhuma página enviada.</div>'}</section>
    ${modal('upload-modal', 'Adicionar páginas', `<form id="upload-form"><label class="upload-zone"><strong>Arraste imagens ou escolha arquivos</strong><span>JPG, PNG, TIFF ou WEBP · até 25 MB</span><input id="page-files" type="file" accept="image/jpeg,image/png,image/tiff,image/webp" multiple required></label><div id="previews" class="previews"></div>${field('Página inicial (fallback)', 'startPage', '1', 'number')}<button class="primary wide">Importar páginas</button></form>`)}
    ${modal('edit-modal', 'Editar projeto', `<form id="edit-form" class="form-grid">${field('Título', 'title', project.title)}${field('Autor', 'author', project.author)}${field('Idioma OCR', 'language', project.language)}<label>Modo<select name="transcriptionMode"><option value="diplomatic" ${project.transcriptionMode === 'diplomatic' ? 'selected' : ''}>Diplomática</option><option value="normalized" ${project.transcriptionMode === 'normalized' ? 'selected' : ''}>Normalizada</option></select></label><label class="wide">Descrição<textarea name="description">${escapeHtml(project.description)}</textarea></label><label class="check wide"><input type="checkbox" name="includeHandwrittenNotes" ${project.includeHandwrittenNotes ? 'checked' : ''}> Incluir notas manuscritas</label><button class="primary wide">Salvar</button></form>`)}`)

  const uploadDialog = root.querySelector('#upload-modal'), filesInput = root.querySelector('#page-files')
  root.querySelector('#add-pages').onclick = () => uploadDialog.showModal()
  root.querySelector('#edit-project').onclick = () => root.querySelector('#edit-modal').showModal()
  filesInput.onchange = () => { const previews = root.querySelector('#previews'); previews.innerHTML = ''; [...filesInput.files].forEach(file => { const img = new Image(); img.src = URL.createObjectURL(file); img.alt = file.name; img.onload = () => URL.revokeObjectURL(img.src); previews.append(img) }) }
  root.querySelector('#upload-form').onsubmit = async event => {
    event.preventDefault(); const files = [...filesInput.files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })), start = Number(new FormData(event.target).get('startPage')) || 1
    try {
      for (const [index, file] of files.entries()) { validateImage(file); await savePage(await createPage(project.id, file, inferPageNumber(file.name, start + index))) }
      await touchProject(project.id); toast(`${files.length} página(s) importada(s).`); await renderProject(root, project.id)
    } catch (error) { toast(error.message, 'error') }
  }
  root.querySelector('#edit-form').onsubmit = async event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); Object.assign(project, data, { includeHandwrittenNotes: Boolean(data.includeHandwrittenNotes) }); delete project.pages; await saveProject(project); await renderProject(root, project.id)
  }
  root.querySelector('#delete-project').onclick = async () => { if (confirm(`Excluir “${project.title}” e todas as imagens armazenadas neste navegador?`)) { await removeProject(project.id); navigate('/') } }
  root.querySelectorAll('.delete-page').forEach(button => button.onclick = async () => { if (confirm('Excluir esta página?')) { await removePage(button.dataset.id); await touchProject(project.id); await renderProject(root, project.id) } })
}
