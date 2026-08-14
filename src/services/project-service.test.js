import { describe, expect, it } from 'vitest'
import { missingPageNumbers, projectStats } from './project-service.js'

describe('project rules', () => {
  it('detects missing pages without creating them', () => {
    expect(missingPageNumbers([{ pageNumber: 112 }, { pageNumber: 114 }, { pageNumber: 115 }])).toEqual([113])
  })
  it('calculates progress', () => {
    const pages = [{ status: 'reviewed', rawOcrText: 'x', processedImage: {} }, { status: 'needs_review', rawOcrText: '', processedImage: null }]
    expect(projectStats(pages)).toEqual({ total: 2, processed: 1, transcribed: 1, reviewed: 1, needsReview: 1 })
  })
})

