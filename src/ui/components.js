import { APP_FULL_NAME } from '../constants.js'
import { getLocale, t, toggleLocale } from '../i18n.js'

export function shell(content) {
  document.documentElement.lang = getLocale()
  setTimeout(() => { const button = document.querySelector('#locale-toggle'); if (button) button.onclick = () => { toggleLocale(); location.reload() } })
  return `<header class="site-header"><a class="brand" href="#/"><strong>BEATRICE</strong><small>${APP_FULL_NAME}</small></a><button id="locale-toggle" class="locale-toggle">${t('languageName')}</button></header><main>${content}</main>`
}

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
export const blobUrl = blob => blob ? URL.createObjectURL(blob) : ''
export const statusLabel = status => t(`status_${status}`)
export function modal(id, title, body, footer = '') {
  return `<dialog id="${id}" class="modal"><form method="dialog"><button class="close" aria-label="${t('close')}">×</button></form><h2>${title}</h2>${body}${footer}</dialog>`
}
export const field = (label, name, value = '', type = 'text') => `<label>${label}<input type="${type}" name="${name}" value="${escapeHtml(value)}" ${name === 'title' ? 'required' : ''}></label>`
export function toast(message, kind = '') {
  let element = document.querySelector('#toast')
  if (!element) { element = document.createElement('div'); element.id = 'toast'; document.body.append(element) }
  element.className = `toast ${kind}`; element.textContent = message; element.hidden = false
  setTimeout(() => { element.hidden = true }, 3500)
}
