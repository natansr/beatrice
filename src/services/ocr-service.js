let activeWorker

export async function runOcr(image, language = 'por', onProgress = () => {}) {
  const { createWorker } = await import('tesseract.js')
  activeWorker = await createWorker(language, 1, { logger: message => onProgress(message) })
  try {
    await activeWorker.setParameters({
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: '3',
      user_defined_dpi: '300',
    })
    const { data } = await activeWorker.recognize(image)
    const blocks = (data.words || []).map(word => ({
      text: word.text, confidence: word.confidence,
      boundingBox: { x: word.bbox.x0, y: word.bbox.y0, width: word.bbox.x1 - word.bbox.x0, height: word.bbox.y1 - word.bbox.y0 },
    }))
    return { fullText: data.text, meanConfidence: data.confidence, blocks }
  } finally {
    await activeWorker.terminate(); activeWorker = null
  }
}

export async function cancelOcr() {
  if (activeWorker) await activeWorker.terminate()
  activeWorker = null
}
