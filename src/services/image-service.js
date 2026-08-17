import { ALLOWED_TYPES, MAX_UPLOAD_BYTES } from '../constants.js'
import { now, uid } from './database.js'

export function inferPageNumber(filename, fallback) {
  const matches = filename.replace(/\.[^.]+$/, '').match(/\d+/g)
  return matches ? Number(matches.at(-1)) : fallback
}

export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error(`Formato não aceito: ${file.name}`)
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name} excede 25 MB.`)
}

async function browserImage(file) {
  if (file.type !== 'image/tiff') return file
  const UTIF = await import('utif')
  const buffer = await file.arrayBuffer(), pages = UTIF.decode(buffer)
  if (!pages.length) throw new Error('TIFF sem páginas legíveis.')
  UTIF.decodeImage(buffer, pages[0])
  const rgba = UTIF.toRGBA8(pages[0]), canvas = document.createElement('canvas')
  canvas.width = pages[0].width; canvas.height = pages[0].height
  canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba), canvas.width, canvas.height), 0, 0)
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', .95))
}

export async function createPage(projectId, file, pageNumber) {
  const timestamp = now()
  return {
    id: uid(), projectId, pageNumber, originalFilename: file.name,
    originalImage: file, displayImage: await browserImage(file), processedImage: null, rawOcrText: '', reviewedText: '',
    normalizedText: '', status: 'uploaded', ocrConfidence: null,
    ocrBlocks: [], notes: '', createdAt: timestamp, updatedAt: timestamp,
  }
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const image = new Image(), url = URL.createObjectURL(blob)
    image.onload = () => { URL.revokeObjectURL(url); resolve(image) }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível abrir a imagem.')) }
    image.src = url
  })
}

export async function processImage(blob, options = {}) {
  const image = await loadImage(blob)
  const scale = Math.max(1, Math.min(2, 2200 / image.width))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  const backgroundSource = document.createElement('canvas')
  const backgroundScale = Math.min(1, 180 / Math.max(canvas.width, canvas.height))
  backgroundSource.width = Math.max(1, Math.round(canvas.width * backgroundScale))
  backgroundSource.height = Math.max(1, Math.round(canvas.height * backgroundScale))
  backgroundSource.getContext('2d').drawImage(canvas, 0, 0, backgroundSource.width, backgroundSource.height)
  const backgroundCanvas = document.createElement('canvas')
  backgroundCanvas.width = backgroundSource.width; backgroundCanvas.height = backgroundSource.height
  const backgroundContext = backgroundCanvas.getContext('2d')
  backgroundContext.filter = 'blur(4px)'
  backgroundContext.drawImage(backgroundSource, 0, 0)
  const background = document.createElement('canvas')
  background.width = canvas.width; background.height = canvas.height
  const expandedContext = background.getContext('2d', { willReadFrequently: true })
  expandedContext.imageSmoothingEnabled = true
  expandedContext.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height)
  const backgroundPixels = expandedContext.getImageData(0, 0, canvas.width, canvas.height)
  const contrast = options.contrast ?? 1.12
  for (let i = 0; i < pixels.data.length; i += 4) {
    let gray = .299 * pixels.data[i] + .587 * pixels.data[i + 1] + .114 * pixels.data[i + 2]
    const localBackground = .299 * backgroundPixels.data[i] + .587 * backgroundPixels.data[i + 1] + .114 * backgroundPixels.data[i + 2]
    gray = Math.min(255, gray * 238 / Math.max(32, localBackground))
    gray = Math.max(0, Math.min(255, (gray - 128) * contrast + 128))
    if (options.threshold) gray = gray > (options.thresholdValue || 165) ? 255 : 0
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = gray
  }
  context.putImageData(pixels, 0, 0)
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', .95))
}

export async function rotateImage(blob, degrees) {
  const image = await loadImage(blob), canvas = document.createElement('canvas')
  const swap = Math.abs(degrees) % 180 === 90
  canvas.width = swap ? image.height : image.width; canvas.height = swap ? image.width : image.height
  const context = canvas.getContext('2d')
  context.translate(canvas.width / 2, canvas.height / 2); context.rotate(degrees * Math.PI / 180)
  context.drawImage(image, -image.width / 2, -image.height / 2)
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', .95))
}
