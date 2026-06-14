import { renderHook, act } from '@testing-library/react'
import { useReducedMotion } from '../useReducedMotion'

describe('useReducedMotion', () => {
  let matchMediaListeners: Record<string, Function>

  beforeEach(() => {
    matchMediaListeners = {}

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn((event: string, fn: Function) => {
          matchMediaListeners[event] = fn
        }),
        removeEventListener: jest.fn(),
      })),
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })
  })

  it('returns false on desktop with no motion preference', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true on mobile viewport (<768px)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('returns true when prefers-reduced-motion matches', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('updates on window resize to mobile', () => {
    let resizeHandler: Function | undefined
    window.addEventListener = jest.fn((event: string, fn: Function) => {
      if (event === 'resize') resizeHandler = fn
    }) as any
    window.removeEventListener = jest.fn() as any

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })
      resizeHandler?.()
    })

    expect(result.current).toBe(true)
  })
})
