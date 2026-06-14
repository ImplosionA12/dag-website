import { render, screen } from '@testing-library/react'
import { HudFrame } from '../HudFrame'

describe('HudFrame', () => {
  it('renders its children', () => {
    render(
      <HudFrame>
        <p>Mission brief</p>
      </HudFrame>
    )
    expect(screen.getByText('Mission brief')).toBeInTheDocument()
  })

  it('renders corner micro-labels when provided', () => {
    render(
      <HudFrame tl="SZN 01" br="LIVE">
        <p>content</p>
      </HudFrame>
    )
    expect(screen.getByText('SZN 01')).toBeInTheDocument()
    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('omits labels when none are provided', () => {
    render(
      <HudFrame>
        <p>content</p>
      </HudFrame>
    )
    expect(screen.queryByText('SZN 01')).not.toBeInTheDocument()
  })

  it('passes custom className', () => {
    const { container } = render(
      <HudFrame className="extra">
        <p>x</p>
      </HudFrame>
    )
    expect(container.firstChild).toHaveClass('extra')
  })
})
