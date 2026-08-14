import { afterEach, describe, expect, it } from 'vitest'
import { getLocale, setLocale, t } from './i18n.js'

const values = new Map()
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
}

afterEach(() => values.clear())

describe('internationalization', () => {
  it('renders English strings', () => { setLocale('en-US'); expect(getLocale()).toBe('en-US'); expect(t('newProject')).toBe('New project') })
  it('renders Portuguese strings and interpolation', () => { setLocale('pt-BR'); expect(t('reviewedCount', { reviewed: 3, total: 4 })).toBe('3 de 4 revisadas') })
})
