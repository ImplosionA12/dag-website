import { render, screen } from '@testing-library/react'
import { SeasonBadge } from '../SeasonBadge'

describe('SeasonBadge', () => {
  it('renders season text uppercased', () => {
    render(<SeasonBadge season="s1" />)
    expect(screen.getByText('S1')).toBeInTheDocument()
  })

  it('handles already uppercase input', () => {
    render(<SeasonBadge season="S2" />)
    expect(screen.getByText('S2')).toBeInTheDocument()
  })

  it('passes custom className', () => {
    const { container } = render(<SeasonBadge season="S1" className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
