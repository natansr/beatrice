import { addRevision, getPage, savePage } from '../services/database.js'
import { processImage, rotateImage } from '../services/image-service.js'
import { runOcr } from '../services/ocr-service.js'
import { projectWithPages, touchProject } from '../services/project-service.js'
import { blobUrl, escapeHtml, shell, statusLabel, toast } from './components.js'
import { navigate } from '../router.js'
import { t } from '../i18n.js'

export async function renderReview(root, projectId, pageId) {
  const project = await projectWithPages(projectId), page = await getPage(pageId)
  if (!project || !page) return navigate('/')
  const index = project.pages.findIndex(item => item.id === page.id), previous = project.pages[index - 1], next = project.pages[index + 1]
  const originalDisplay = page.displayImage || page.originalImage
  let imageUrl = blobUrl(originalDisplay), zoom = 1, saveTimer
  root.innerHTML = shell(`<section class="review-head"><a href="#/project/${project.id}">← ${escapeHtml(project.title)}</a><div>${previous ? `<a class="button" href="#/project/${project.id}/page/${previous.id}">${t('previous')}</a>` : ''}<label>${t('page')} <input id="page-number" type="number" value="${page.pageNumber}" min="1"></label>${next ? `<a class="button" href="#/project/${project.id}/page/${next.id}">${t('next')}</a>` : ''}</div><span id="save-state">${t('saved')}</span></section>
    <section class="review-grid"><article class="image-panel"><div class="toolbar"><button data-zoom="in">＋</button><button data-zoom="out">−</button><button data-zoom="fit">${t('fit')}</button><button data-zoom="reset">100%</button><i></i><button class="source active" data-source="original">${t('original')}</button>${page.processedImage ? `<button class="source" data-source="processed">${t('processedImage')}</button>` : ''}<button data-rotate="-90">↶</button><button data-rotate="90">↷</button></div><div id="viewport"><img id="page-image" src="${imageUrl}" alt="${t('page')} ${page.pageNumber}"></div></article>
    <article class="text-panel"><div class="toolbar"><button id="process">${t('processImage')}</button><button id="ocr">${t('runOcr')}</button><button id="needs" class="warning-button">${t('markReview')}</button><button id="reviewed" class="primary">${t('markReviewed')}</button></div><div id="ocr-progress" class="ocr-progress" hidden><div></div><span></span></div><label class="sr-only" for="reviewed-text">${t('transcription')}</label><textarea id="reviewed-text" spellcheck="false" placeholder="${t('transcriptionPlaceholder')}">${escapeHtml(page.reviewedText)}</textarea><footer><em id="status" class="status ${page.status}">${statusLabel(page.status)}</em><span>${page.ocrConfidence != null ? t('ocrConfidence', { value: page.ocrConfidence.toFixed(1) }) : ''}</span></footer></article></section>`)

  const image = root.querySelector('#page-image'), text = root.querySelector('#reviewed-text'), state = root.querySelector('#save-state')
  const persist = async () => { page.reviewedText = text.value; page.pageNumber = Number(root.querySelector('#page-number').value); await savePage(page); await touchProject(project.id); state.textContent = t('saved') }
  text.oninput = () => { state.textContent = t('unsaved'); clearTimeout(saveTimer); saveTimer = setTimeout(persist, 1000) }
  root.querySelector('#page-number').onchange = persist
  root.querySelectorAll('[data-zoom]').forEach(button => button.onclick = () => { const action = button.dataset.zoom; if (action === 'in') zoom += .2; if (action === 'out') zoom = Math.max(.4, zoom - .2); if (action === 'fit' || action === 'reset') zoom = 1; image.style.transform = `scale(${zoom})` })
  root.querySelectorAll('.source').forEach(button => button.onclick = () => { URL.revokeObjectURL(imageUrl); imageUrl = blobUrl(button.dataset.source === 'processed' ? page.processedImage : originalDisplay); image.src = imageUrl; root.querySelectorAll('.source').forEach(item => item.classList.remove('active')); button.classList.add('active') })
  root.querySelector('#process').onclick = async () => { try { state.textContent = t('processing'); page.status = 'processing'; page.processedImage = await processImage(originalDisplay); page.status = 'pending'; await savePage(page); toast(t('imageProcessed')); await renderReview(root, project.id, page.id) } catch (error) { page.status = 'error'; await savePage(page); toast(error.message, 'error') } }
  root.querySelectorAll('[data-rotate]').forEach(button => button.onclick = async () => { page.processedImage = await rotateImage(page.processedImage || originalDisplay, Number(button.dataset.rotate)); await savePage(page); await renderReview(root, project.id, page.id) })
  root.querySelector('#ocr').onclick = async () => {
    const progress = root.querySelector('#ocr-progress'); progress.hidden = false; page.status = 'processing'; await savePage(page)
    try {
      await addRevision(page, 'before_ocr'); const result = await runOcr(page.processedImage || originalDisplay, project.language || 'por', message => { if (message.progress != null) { progress.querySelector('div').style.width = `${message.progress * 100}%`; progress.querySelector('span').textContent = `${message.status} ${Math.round(message.progress * 100)}%` } })
      page.rawOcrText = result.fullText; if (!page.reviewedText) page.reviewedText = result.fullText; page.ocrConfidence = result.meanConfidence; page.ocrBlocks = result.blocks; page.status = 'needs_review'; await savePage(page); await touchProject(project.id); await renderReview(root, project.id, page.id)
    } catch (error) { page.status = 'error'; await savePage(page); toast(t('ocrFailed', { message: error.message }), 'error'); await renderReview(root, project.id, page.id) }
  }
  root.querySelector('#reviewed').onclick = async () => { await persist(); await addRevision(page, 'marked_reviewed'); page.status = 'reviewed'; await savePage(page); await touchProject(project.id); root.querySelector('#status').className = 'status reviewed'; root.querySelector('#status').textContent = statusLabel('reviewed') }
  root.querySelector('#needs').onclick = async () => { await persist(); page.status = 'needs_review'; await savePage(page); root.querySelector('#status').className = 'status needs_review'; root.querySelector('#status').textContent = statusLabel('needs_review') }
}
