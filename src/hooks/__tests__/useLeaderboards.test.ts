import { renderHook, waitFor } from '@testing-library/react'
import { useLeaderboards } from '../useLeaderboards'

const mockEntries = [
  { id: '1', event_name: 'Tourney', season: 'S1', rank: 1, player_name: 'Alpha', points: 100, game_type: 'BGMI' },
]

describe('useLeaderboards', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches leaderboards successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ leaderboards: mockEntries }),
      })
    ) as any

    const { result } = renderHook(() => useLeaderboards())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockEntries)
    expect(result.current.error).toBeNull()
  })

  it('handles errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 404 })
    ) as any

    const { result } = renderHook(() => useLeaderboards())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('HTTP 404')
  })

  it('defaults to empty array when key is missing', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as any

    const { result } = renderHook(() => useLeaderboards())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual([])
  })
})
