const listeners = new Set()

export function currentRoute() {
  const path = location.hash.slice(1) || '/'
  const parts = path.split('/').filter(Boolean)
  if (!parts.length) return { name: 'home' }
  if (parts[0] === 'project' && parts[2] === 'page') return { name: 'review', projectId: parts[1], pageId: parts[3] }
  if (parts[0] === 'project' && parts[2] === 'export') return { name: 'export', projectId: parts[1] }
  if (parts[0] === 'project') return { name: 'project', projectId: parts[1] }
  return { name: 'notFound' }
}

export const link = path => `#${path}`
export function navigate(path) { location.hash = path }
export function onRoute(callback) { listeners.add(callback); return () => listeners.delete(callback) }
window.addEventListener('hashchange', () => listeners.forEach(callback => callback(currentRoute())))

