import { getProject, listPages, now, saveProject, uid } from './database.js'

export function newProject(data) {
  const timestamp = now()
  return {
    id: uid(), title: data.title.trim(), author: data.author?.trim() || '',
    description: data.description?.trim() || '', language: data.language || 'por',
    transcriptionMode: data.transcriptionMode || 'diplomatic',
    includeHandwrittenNotes: Boolean(data.includeHandwrittenNotes),
    status: 'active', createdAt: timestamp, updatedAt: timestamp,
  }
}

export async function projectWithPages(id) {
  const project = await getProject(id)
  if (!project) return null
  return { ...project, pages: await listPages(id) }
}

export function projectStats(pages) {
  return {
    total: pages.length,
    processed: pages.filter(page => page.processedImage).length,
    transcribed: pages.filter(page => page.rawOcrText).length,
    reviewed: pages.filter(page => page.status === 'reviewed').length,
    needsReview: pages.filter(page => page.status === 'needs_review').length,
  }
}

export function missingPageNumbers(pages) {
  const numbers = [...new Set(pages.map(page => page.pageNumber))].sort((a, b) => a - b)
  if (numbers.length < 2) return []
  return Array.from({ length: numbers.at(-1) - numbers[0] + 1 }, (_, i) => numbers[0] + i).filter(n => !numbers.includes(n))
}

export async function touchProject(projectId) {
  const project = await getProject(projectId)
  if (project) await saveProject(project)
}

