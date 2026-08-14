const textFor = (page, options) => options.transcription === 'normalized' ? page.normalizedText : page.reviewedText
const selectedPages = (project, options) => project.pages
  .filter(page => options.includeUnreviewed || page.status === 'reviewed')
  .sort((a, b) => a.pageNumber - b.pageNumber)

export function buildTxt(project, options) {
  const chunks = options.includeMetadata ? [`${project.title}\n${project.author}`.trim()] : []
  for (const page of selectedPages(project, options)) {
    const marker = options.includePageNumbers ? `${'='.repeat(20)}\nPÁGINA ${page.pageNumber}\n${'='.repeat(20)}\n` : ''
    chunks.push(marker + textFor(page, options))
  }
  return chunks.join('\n\n')
}

export function buildMarkdown(project, options) {
  const chunks = options.includeMetadata ? [`# ${project.title}\n\n**Autor:** ${project.author}`] : []
  for (const page of selectedPages(project, options)) {
    chunks.push(`${options.includePageNumbers ? `## Página ${page.pageNumber}\n\n` : ''}${textFor(page, options)}`)
  }
  return chunks.join('\n\n')
}

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
export function buildHtml(project, options) {
  const header = options.includeMetadata ? `<header><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.author)}</p></header>` : ''
  const pages = selectedPages(project, options).map(page => {
    const heading = options.includePageNumbers ? `<h2>Página ${page.pageNumber}</h2>` : ''
    const paragraphs = textFor(page, options).split(/\n\n+/).map(p => `<p>${escapeHtml(p).replaceAll('\n', '<br>')}</p>`).join('')
    return `<section data-page="${page.pageNumber}">${heading}${paragraphs}</section>`
  }).join('')
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(project.title)}</title></head><body><article>${header}${pages}</article></body></html>`
}

export function buildJson(project, options) {
  return JSON.stringify({ software: 'BEATRICE', title: project.title, author: project.author, language: project.language,
    transcription_mode: options.transcription, exported_at: new Date().toISOString(), pages: selectedPages(project, options).map(page => ({
      page_number: page.pageNumber, status: page.status, ocr_text: page.rawOcrText,
      reviewed_text: page.reviewedText, normalized_text: page.normalizedText,
    })) }, null, 2)
}

export async function buildDocx(project, options) {
  const { Document, HeadingLevel, Packer, PageBreak, Paragraph } = await import('docx')
  const children = []
  if (options.includeMetadata || options.titlePage) {
    children.push(new Paragraph({ text: project.title, heading: HeadingLevel.TITLE }), new Paragraph(project.author))
    if (options.titlePage) children.push(new Paragraph({ children: [new PageBreak()] }))
  }
  selectedPages(project, options).forEach((page, index, pages) => {
    if (options.includePageNumbers) children.push(new Paragraph({ text: `Página ${page.pageNumber}`, heading: HeadingLevel.HEADING_2 }))
    textFor(page, options).split(/\n\n+/).forEach(text => children.push(new Paragraph(text)))
    if (options.preserveBoundaries && index < pages.length - 1) children.push(new Paragraph({ children: [new PageBreak()] }))
  })
  return Packer.toBlob(new Document({ sections: [{ children }] }))
}

export async function buildPdf(project, options) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' }), margin = 20, width = 170, bottom = 277
  let y = margin
  const write = (text, size = 11) => {
    pdf.setFontSize(size)
    for (const line of pdf.splitTextToSize(text || ' ', width)) {
      if (y > bottom) { pdf.addPage(); y = margin }
      pdf.text(line, margin, y); y += size * .45
    }
    y += 3
  }
  if (options.includeMetadata || options.titlePage) {
    write(project.title, 20); write(project.author, 12)
    if (options.titlePage) { pdf.addPage(); y = margin }
  }
  selectedPages(project, options).forEach((page, index, pages) => {
    if (options.includePageNumbers) write(`Página ${page.pageNumber}`, 15)
    write(textFor(page, options), 11)
    if (options.preserveBoundaries && index < pages.length - 1) { pdf.addPage(); y = margin }
  })
  return pdf.output('blob')
}

export async function createExport(project, options) {
  const format = options.format
  if (format === 'docx') return { blob: await buildDocx(project, options), extension: 'docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  if (format === 'pdf') return { blob: await buildPdf(project, options), extension: 'pdf', type: 'application/pdf' }
  const builders = { txt: buildTxt, md: buildMarkdown, html: buildHtml, json: buildJson }
  const types = { txt: 'text/plain;charset=utf-8', md: 'text/markdown;charset=utf-8', html: 'text/html;charset=utf-8', json: 'application/json;charset=utf-8' }
  return { blob: new Blob([builders[format](project, options)], { type: types[format] }), extension: format, type: types[format] }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a')
  anchor.href = url; anchor.download = filename; anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
