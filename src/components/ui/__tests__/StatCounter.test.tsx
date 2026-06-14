import { render, screen } from '@testing-library/react'
import { StatCounter } from '../StatCounter'

// jest.setup.ts is shared/frozen — mock browser APIs locally
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: true, // prefers-reduced-motion: reduce → counter renders final value
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  })
  class MockIntersectionObserver {
    observe = jest.fn()
    unobserve = jest.fn()
    disconnect = jest.fn()
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  })
})

describe('StatCounter', () => {
  it('renders the final value immediately under reduced motion', () => {
    render(<StatCounter value={42} label="EVENTS HELD" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders the label', () => {
    render(<StatCounter value={3} label="SEASONS" />)
    expect(screen.getByText('SEASONS')).toBeInTheDocument()
  })

  it('appends the suffix', () => {
    render(<StatCounter value={99} suffix="+" label="PLAYERS" />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('handles zero', () => {
    render(<StatCounter value={0} label="CHAMPIONS" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
