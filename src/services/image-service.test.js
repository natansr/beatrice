import { describe, expect, it } from 'vitest'
import { inferPageNumber, validateImage } from './image-service.js'

describe('image rules', () => {
  it('infers the last number in a filename', () => expect(inferPageNumber('book_scan_0116.jpg', 1)).toBe(116))
  it('uses the fallback when no number exists', () => expect(inferPageNumber('frontispiece.png', 3)).toBe(3))
  it('rejects executable content by MIME type', () => expect(() => validateImage({ name: 'bad.exe', type: 'application/x-msdownload', size: 20 })).toThrow())
})

