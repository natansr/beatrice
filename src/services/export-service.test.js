import { describe, expect, it } from 'vitest'
import { buildHtml, buildJson, buildMarkdown, buildTxt } from './export-service.js'

const project = { title: 'A Idade Média', author: 'Ivan Lins', language: 'por', pages: [{ pageNumber: 112, status: 'reviewed', rawOcrText: 'sobre', reviewedText: 'sôbre êste texto', normalizedText: 'sobre este texto' }, { pageNumber: 113, status: 'needs_review', rawOcrText: 'rascunho', reviewedText: 'rascunho', normalizedText: '' }] }
const options = { transcription: 'diplomatic', includePageNumbers: true, includeMetadata: true, includeUnreviewed: false }

describe('text exporters', () => {
  it('preserves diplomatic spelling in TXT', () => expect(buildTxt(project, options)).toContain('sôbre êste'))
  it('adds Markdown page headings', () => expect(buildMarkdown(project, options)).toContain('## Página 112'))
  it('creates semantic HTML and escapes text', () => expect(buildHtml({ ...project, title: '<obra>' }, options)).toContain('&lt;obra&gt;'))
  it('keeps raw and reviewed text in JSON', () => { const data = JSON.parse(buildJson(project, options)); expect(data.software).toBe('BEATRICE'); expect(data.pages[0].ocr_text).toBe('sobre'); expect(data.pages).toHaveLength(1) })
})

