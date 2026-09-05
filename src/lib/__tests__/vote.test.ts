import { getVoterKey, getStoredVote, storeVote, castVote, VOTED_CHOICE_UNKNOWN } from '../vote'

describe('vote', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    window.localStorage.clear()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  describe('getVoterKey', () => {
    it('returns a stable key across calls', () => {
      expect(getVoterKey()).toBe(getVoterKey())
    })

    it('persists the key so a reload keeps the same voter', () => {
      const key = getVoterKey()

      expect(window.localStorage.getItem('dag:voter-key')).toBe(key)
    })

    it('still returns a key when storage throws', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage disabled')
      })
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage disabled')
      })

      expect(getVoterKey()).toEqual(expect.any(String))
    })
  })

  describe('stored votes', () => {
    it('round-trips a vote per poll', () => {
      storeVote('poll-a', 'option-1')

      expect(getStoredVote('poll-a')).toBe('option-1')
      expect(getStoredVote('poll-b')).toBeNull()
    })
  })

  describe('castVote', () => {
    it('records the choice on success', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch

      await expect(castVote('poll-a', 'option-1')).resolves.toBe('ok')
      expect(getStoredVote('poll-a')).toBe('option-1')
    })

    it('treats a duplicate as already voted and remembers it', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ code: '23505' }),
      }) as unknown as typeof fetch

      await expect(castVote('poll-a', 'option-1')).resolves.toBe('already-voted')
      // The ballot must close, but the counted vote may be a different option — recording
      // the clicked one would report the wrong choice back to the voter.
      expect(getStoredVote('poll-a')).toBe(VOTED_CHOICE_UNKNOWN)
      expect(getStoredVote('poll-a')).not.toBe('option-1')
    })

    it('reports a closed poll when RLS refuses the row', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ code: '42501' }),
      }) as unknown as typeof fetch

      await expect(castVote('poll-a', 'option-1')).resolves.toBe('closed')
      expect(getStoredVote('poll-a')).toBeNull()
    })

    it('reports an error when the request fails outright', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch

      await expect(castVote('poll-a', 'option-1')).resolves.toBe('error')
      expect(getStoredVote('poll-a')).toBeNull()
    })

    it('reports an error rather than throwing when Supabase is not configured', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      const spy = jest.fn()
      global.fetch = spy as unknown as typeof fetch

      await expect(castVote('poll-a', 'option-1')).resolves.toBe('error')
      expect(spy).not.toHaveBeenCalled()
    })

    it('sends the poll, option and voter key', async () => {
      const spy = jest.fn().mockResolvedValue({ ok: true })
      global.fetch = spy as unknown as typeof fetch

      await castVote('poll-a', 'option-1')

      const body = JSON.parse(spy.mock.calls[0][1].body)
      expect(body).toEqual({
        poll_id: 'poll-a',
        option_id: 'option-1',
        voter_key: expect.any(String),
      })
    })
  })
})
