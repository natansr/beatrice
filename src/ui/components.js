import { APP_FULL_NAME } from '../constants.js'

export function shell(content) {
  return `<header class="site-header"><a class="brand" href="#/"><strong>BEATRICE</strong><small>${APP_FULL_NAME}</small></a><span class="local-badge" title="Os documentos permanecem neste navegador">● Local-first</span></header><main>${content}</main>`
}

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
export const blobUrl = blob => blob ? URL.createObjectURL(blob) : ''
export const statusLabel = status => ({ reviewed: '✓ Revisada', needs_review: '⚠ A revisar', uploaded: '○ Enviada', pending: '○ Pendente', processing: '◌ Processando', transcribed: '○ Transcrita', error: '× Erro' })[status] || status
export function modal(id, title, body, footer = '') {
  return `<dialog id="${id}" class="modal"><form method="dialog"><button class="close" aria-label="Fechar">×</button></form><h2>${title}</h2>${body}${footer}</dialog>`
}
export const field = (label, name, value = '', type = 'text') => `<label>${label}<input type="${type}" name="${name}" value="${escapeHtml(value)}" ${name === 'title' ? 'required' : ''}></label>`
export function toast(message, kind = '') {
  let element = document.querySelector('#toast')
  if (!element) { element = document.createElement('div'); element.id = 'toast'; document.body.append(element) }
  element.className = `toast ${kind}`; element.textContent = message; element.hidden = false
  setTimeout(() => { element.hidden = true }, 3500)
}

