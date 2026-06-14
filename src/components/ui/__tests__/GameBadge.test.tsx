import { render, screen } from '@testing-library/react'
import { GameBadge } from '../GameBadge'

describe('GameBadge', () => {
  it('renders BGMI label', () => {
    render(<GameBadge game="BGMI" />)
    expect(screen.getByText('BGMI')).toBeInTheDocument()
  })

  it('renders FREE FIRE label for FF game type', () => {
    render(<GameBadge game="FF" />)
    expect(screen.getByText('FREE FIRE')).toBeInTheDocument()
  })

  it('renders VALORANT label', () => {
    render(<GameBadge game="Valorant" />)
    expect(screen.getByText('VALORANT')).toBeInTheDocument()
  })

  it('renders ANIME label', () => {
    render(<GameBadge game="Anime" />)
    expect(screen.getByText('ANIME')).toBeInTheDocument()
  })

  it('renders OTHER label', () => {
    render(<GameBadge game="Other" />)
    expect(screen.getByText('OTHER')).toBeInTheDocument()
  })

  it('applies sm size classes by default', () => {
    const { container } = render(<GameBadge game="BGMI" />)
    expect(container.firstChild).toHaveClass('px-2', 'py-0.5')
  })

  it('applies md size classes when specified', () => {
    const { container } = render(<GameBadge game="BGMI" size="md" />)
    expect(container.firstChild).toHaveClass('px-3', 'py-1')
  })

  it('passes custom className', () => {
    const { container } = render(<GameBadge game="BGMI" className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
