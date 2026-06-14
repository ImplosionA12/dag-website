import { validateEnv } from '../env'

describe('validateEnv', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  it('warns when optional env vars are missing', () => {
    delete process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL
    delete process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL
    delete process.env.NEXT_PUBLIC_SHEETS_HOF_URL
    delete process.env.NEXT_PUBLIC_JOIN_FORM_URL

    validateEnv()

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Optional env vars not set')
    )
  })

  it('warns when NEXT_PUBLIC_SITE_URL uses placeholder', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://yourdomain.com'

    validateEnv()

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_SITE_URL is not configured')
    )
  })

  it('does not warn for optional vars when they are set', () => {
    process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SHEETS_HOF_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SHEETS_POLLS_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_JOIN_FORM_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com'

    validateEnv()

    expect(console.warn).not.toHaveBeenCalled()
  })
})
