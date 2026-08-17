let activeWorker

function wordsFromBlocks(blocks) {
  return (blocks || []).flatMap(block => (block.paragraphs || []).flatMap(paragraph =>
    (paragraph.lines || []).flatMap(line => line.words || [])))
}

export async function runOcr(images, language = 'por', onProgress = () => {}) {
  const { createWorker } = await import('tesseract.js')
  let currentPass = 1, totalPasses = 1
  activeWorker = await createWorker(language, 1, { logger: message => onProgress({ ...message, pass: currentPass, passes: totalPasses }) })
  try {
    await activeWorker.setParameters({
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: '3',
      user_defined_dpi: '300',
    })
    const candidates = Array.isArray(images) ? images : [images]
    totalPasses = candidates.length
    let best
    for (let index = 0; index < candidates.length; index += 1) {
      currentPass = index + 1
      onProgress({ status: 'recognizing', progress: 0, pass: index + 1, passes: candidates.length })
      const { data } = await activeWorker.recognize(candidates[index], {}, { text: true, blocks: true })
      if (!best || (data.confidence ?? 0) > (best.confidence ?? 0)) best = data
    }
    const blocks = wordsFromBlocks(best.blocks).map(word => ({
      text: word.text, confidence: word.confidence,
      boundingBox: { x: word.bbox.x0, y: word.bbox.y0, width: word.bbox.x1 - word.bbox.x0, height: word.bbox.y1 - word.bbox.y0 },
    }))
    return { fullText: best.text, meanConfidence: best.confidence, blocks }
  } finally {
    await activeWorker.terminate(); activeWorker = null
  }
}

export async function cancelOcr() {
  if (activeWorker) await activeWorker.terminate()
  activeWorker = null
}
