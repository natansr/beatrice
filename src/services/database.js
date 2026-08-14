import { openDB } from 'idb'

const DB_NAME = 'beatrice'
const DB_VERSION = 1

const connection = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const projects = db.createObjectStore('projects', { keyPath: 'id' })
    projects.createIndex('updatedAt', 'updatedAt')
    const pages = db.createObjectStore('pages', { keyPath: 'id' })
    pages.createIndex('projectId', 'projectId')
    pages.createIndex('projectPage', ['projectId', 'pageNumber'], { unique: false })
    const revisions = db.createObjectStore('revisions', { keyPath: 'id' })
    revisions.createIndex('pageId', 'pageId')
  },
})

export const uid = () => crypto.randomUUID()
export const now = () => new Date().toISOString()

export async function listProjects() {
  return (await (await connection).getAll('projects')).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}
export const getProject = async id => (await connection).get('projects', id)
export async function saveProject(project) {
  project.updatedAt = now()
  await (await connection).put('projects', project)
  return project
}
export async function removeProject(id) {
  const db = await connection
  const tx = db.transaction(['projects', 'pages', 'revisions'], 'readwrite')
  const pages = await tx.objectStore('pages').index('projectId').getAll(id)
  for (const page of pages) {
    const revisions = await tx.objectStore('revisions').index('pageId').getAll(page.id)
    for (const revision of revisions) await tx.objectStore('revisions').delete(revision.id)
    await tx.objectStore('pages').delete(page.id)
  }
  await tx.objectStore('projects').delete(id)
  await tx.done
}
export async function listPages(projectId) {
  const result = await (await connection).getAllFromIndex('pages', 'projectId', projectId)
  return result.sort((a, b) => a.pageNumber - b.pageNumber)
}
export const getPage = async id => (await connection).get('pages', id)
export async function savePage(page) {
  page.updatedAt = now()
  await (await connection).put('pages', page)
  return page
}
export const removePage = async id => (await connection).delete('pages', id)
export async function addRevision(page, reason) {
  if (!page.reviewedText) return
  await (await connection).put('revisions', { id: uid(), pageId: page.id, text: page.reviewedText, reason, createdAt: now() })
}
export const listRevisions = async pageId => (await connection).getAllFromIndex('revisions', 'pageId', pageId)

export async function clearDatabase() {
  const db = await connection
  const tx = db.transaction(['projects', 'pages', 'revisions'], 'readwrite')
  await Promise.all(['projects', 'pages', 'revisions'].map(store => tx.objectStore(store).clear()))
  await tx.done
}

