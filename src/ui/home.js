import { listProjects, saveProject } from '../services/database.js'
import { newProject } from '../services/project-service.js'
import { escapeHtml, field, modal, shell, toast } from './components.js'
import { navigate } from '../router.js'

export async function renderHome(root) {
  const projects = await listProjects()
  root.innerHTML = shell(`<section class="hero"><div><p class="eyebrow">Preservação documental no seu navegador</p><h1>Projetos</h1><p>Transcrição fiel, revisão humana e exportação reproduzível.</p></div><button class="primary" id="new-project">Novo projeto</button></section>
  <section class="project-grid">${projects.map(project => `<a class="project-card" href="#/project/${project.id}"><span class="dot"></span><h2>${escapeHtml(project.title)}</h2><p>${escapeHtml(project.author || 'Autor não informado')}</p><small>Atualizado ${new Date(project.updatedAt).toLocaleDateString('pt-BR')}</small></a>`).join('') || '<div class="empty"><h2>Comece uma transcrição</h2><p>Crie um projeto. Seus dados permanecem neste dispositivo.</p></div>'}</section>
  ${modal('project-modal', 'Novo projeto', `<form id="project-form" class="form-grid">${field('Título', 'title')}${field('Autor', 'author')}${field('Idioma OCR', 'language', 'por')}<label>Modo<select name="transcriptionMode"><option value="diplomatic">Transcrição diplomática</option><option value="normalized">Transcrição normalizada</option></select></label><label class="wide">Descrição<textarea name="description"></textarea></label><label class="check wide"><input type="checkbox" name="includeHandwrittenNotes"> Incluir notas marginais manuscritas</label><button class="primary wide">Criar projeto</button></form>`)}`)
  const dialog = root.querySelector('#project-modal')
  root.querySelector('#new-project').onclick = () => dialog.showModal()
  root.querySelector('#project-form').onsubmit = async event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); data.includeHandwrittenNotes = Boolean(data.includeHandwrittenNotes)
    try { const project = newProject(data); await saveProject(project); dialog.close(); navigate(`/project/${project.id}`) } catch (error) { toast(error.message, 'error') }
  }
}

