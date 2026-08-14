import './styles.css'
import { currentRoute, onRoute } from './router.js'
import { renderExport } from './ui/export.js'
import { renderHome } from './ui/home.js'
import { renderProject } from './ui/project.js'
import { renderReview } from './ui/review.js'
import { shell } from './ui/components.js'

const root = document.querySelector('#app')

async function render(route = currentRoute()) {
  document.querySelectorAll('img[src^="blob:"]').forEach(image => URL.revokeObjectURL(image.src))
  if (route.name === 'home') return renderHome(root)
  if (route.name === 'project') return renderProject(root, route.projectId)
  if (route.name === 'review') return renderReview(root, route.projectId, route.pageId)
  if (route.name === 'export') return renderExport(root, route.projectId)
  root.innerHTML = shell('<section class="empty"><h1>Página não encontrada</h1><a href="#/">Voltar</a></section>')
}

onRoute(render)
render()

