import { resolveSheetUrl } from '../sheets'

describe('resolveSheetUrl', () => {
  const full =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vAbC/pub?gid=123&single=true&output=csv'

  it('passes a complete CSV export URL through untouched', () => {
    expect(resolveSheetUrl(full)).toBe(full)
  })

  it('rebuilds a URL from a bare gid', () => {
    const resolved = resolveSheetUrl('2073944891')

    expect(resolved).toMatch(/^https:\/\/docs\.google\.com\/spreadsheets\//)
    expect(resolved).toContain('gid=2073944891')
    expect(resolved).toContain('single=true&output=csv')
  })

  it('completes a published URL that lost its CSV params', () => {
    expect(resolveSheetUrl('https://docs.google.com/spreadsheets/d/e/2PACX-1vAbC/pub?gid=123'))
      .toBe('https://docs.google.com/spreadsheets/d/e/2PACX-1vAbC/pub?gid=123&single=true&output=csv')
  })

  it('strips quotes and surrounding whitespace', () => {
    expect(resolveSheetUrl(`  "${full}"  `)).toBe(full)
  })

  it('returns null when unset or empty', () => {
    expect(resolveSheetUrl(undefined)).toBeNull()
    expect(resolveSheetUrl('   ')).toBeNull()
  })

  it('returns null for a value that is neither a URL nor a gid', () => {
    expect(resolveSheetUrl('not a url')).toBeNull()
  })
})
