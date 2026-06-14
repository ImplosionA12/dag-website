import { renderHook, waitFor } from '@testing-library/react'
import { useHallOfFame } from '../useHallOfFame'

const mockEntries = [
  { category: 'Highest Scorer', player_name: 'Player1', season: 'S1', description: 'Top', game_type: 'BGMI' },
]

describe('useHallOfFame', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches hall of fame successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ hall_of_fame: mockEntries }),
      })
    ) as any

    const { result } = renderHook(() => useHallOfFame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockEntries)
  })

  it('handles errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed'))
    ) as any

    const { result } = renderHook(() => useHallOfFame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed')
  })
})
