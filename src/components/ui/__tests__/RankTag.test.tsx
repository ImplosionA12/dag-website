import { render, screen } from '@testing-library/react'
import { RankTag } from '../RankTag'

describe('RankTag', () => {
  it('renders ordinal labels', () => {
    render(<RankTag rank={1} />)
    expect(screen.getByText('1st')).toBeInTheDocument()
  })

  it('renders 2nd and 3rd', () => {
    const { rerender } = render(<RankTag rank={2} />)
    expect(screen.getByText('2nd')).toBeInTheDocument()
    rerender(<RankTag rank={3} />)
    expect(screen.getByText('3rd')).toBeInTheDocument()
  })

  it('renders nth for ranks past the podium', () => {
    render(<RankTag rank={7} />)
    expect(screen.getByText('7th')).toBeInTheDocument()
  })

  it('gives rank 1 the gold victory treatment', () => {
    render(<RankTag rank={1} />)
    const tag = screen.getByText('1st')
    expect(tag).toHaveClass('animate-pulse-gold')
    expect(tag).toHaveStyle({ background: 'var(--gold-400)' })
  })

  it('does not give gold to other ranks', () => {
    render(<RankTag rank={2} />)
    expect(screen.getByText('2nd')).not.toHaveClass('animate-pulse-gold')
  })
})
