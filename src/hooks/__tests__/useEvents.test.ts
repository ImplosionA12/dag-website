import { renderHook, waitFor } from '@testing-library/react'
import { useEvents } from '../useEvents'

const mockEvents = [
  { id: '1', event_name: 'Test', date: '2099-01-01', description: '', season: 'S1', status: 'open', event_type: 'tournament', register_url: '', game_type: 'BGMI' },
]

describe('useEvents', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('starts in loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any
    const { result } = renderHook(() => useEvents())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('fetches events successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events: mockEvents }),
      })
    ) as any

    const { result } = renderHook(() => useEvents())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockEvents)
    expect(result.current.error).toBeNull()
  })

  it('handles HTTP errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ) as any

    const { result } = renderHook(() => useEvents())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('HTTP 500')
  })

  it('handles network errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as any

    const { result } = renderHook(() => useEvents())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('defaults to empty array when events key is missing', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as any

    const { result } = renderHook(() => useEvents())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual([])
  })
})
