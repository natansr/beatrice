export const APP_NAME = 'BEATRICE'
export const APP_FULL_NAME = 'Book Extraction And Transcription with Review, Image Correction and Export'
export const PAGE_STATUSES = ['uploaded', 'pending', 'processing', 'transcribed', 'needs_review', 'reviewed', 'error']
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp']
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

export const VISION_PROMPT = `Transcribe this page diplomatically and faithfully.
Do not modernize spelling. Do not correct grammar. Preserve original accents,
punctuation, capitalization, quotations, footnotes, footnote numbers and historical
orthography. Never invent unclear content. The image is the primary source of truth.`

