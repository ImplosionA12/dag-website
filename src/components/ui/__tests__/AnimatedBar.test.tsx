import { render, screen } from '@testing-library/react'
import { AnimatedBar } from '../AnimatedBar'

// Framer Motion's whileInView needs IntersectionObserver in jsdom
beforeAll(() => {
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

describe('AnimatedBar', () => {
  it('renders the label and default percentage readout', () => {
    render(<AnimatedBar label="Valorant Night" percentage={62} />)
    expect(screen.getByText('Valorant Night')).toBeInTheDocument()
    expect(screen.getByText('62%')).toBeInTheDocument()
  })

  it('clamps percentages above 100', () => {
    render(<AnimatedBar label="Over" percentage={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('clamps negative percentages to 0', () => {
    render(<AnimatedBar label="Under" percentage={-20} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('uses a custom readout when provided', () => {
    render(<AnimatedBar label="Opt A" percentage={40} readout="40% · 12" />)
    expect(screen.getByText('40% · 12')).toBeInTheDocument()
    expect(screen.queryByText('40%')).not.toBeInTheDocument()
  })
})
