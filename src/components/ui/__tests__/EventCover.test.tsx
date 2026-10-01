import { render, screen } from '@testing-library/react'
import { EventCover } from '../EventCover'

const base = {
  id: 'ignis-s1',
  event_name: 'IGNIS S1',
  date: '2026-07-25',
  game_type: 'BGMI' as const,
  event_type: 'tournament' as const,
}

describe('EventCover', () => {
  it('shows the poster when one is set', () => {
    render(<EventCover event={{ ...base, poster_url: 'https://example.com/ignis.jpg' }} />)
    const img = screen.getByRole('img', { name: 'IGNIS S1 poster' })
    expect(img).toHaveAttribute('src', 'https://example.com/ignis.jpg')
  })

  it('generates cover art when there is no poster', () => {
    const { container } = render(<EventCover event={base} />)
    expect(screen.getByRole('img', { name: 'IGNIS S1 cover art' })).toBeInTheDocument()
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container).toHaveTextContent('IGNIS')
    expect(container).toHaveTextContent('25.07.26')
  })

  it('draws the same cover for the same event every time', () => {
    const a = render(<EventCover event={base} />).container.querySelector('radialGradient')
    const b = render(<EventCover event={base} />).container.querySelector('radialGradient')
    expect(a?.getAttribute('cx')).toBe(b?.getAttribute('cx'))
    expect(a?.getAttribute('cy')).toBe(b?.getAttribute('cy'))
  })

  it('can drop the wordmark', () => {
    const { container } = render(<EventCover event={base} wordmark={false} />)
    expect(container).not.toHaveTextContent('IGNIS')
  })
})
