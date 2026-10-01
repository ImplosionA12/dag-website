import { render, screen } from '@testing-library/react'
import { MemberPortrait } from '../MemberPortrait'

describe('MemberPortrait', () => {
  it('shows the photo when one is set', () => {
    render(<MemberPortrait name="Tejash" games={['FF']} photoUrl="https://example.com/t.jpg" />)
    expect(screen.getByRole('img', { name: 'Tejash' })).toHaveAttribute('src', 'https://example.com/t.jpg')
  })

  it('generates a tile with initials when there is no photo', () => {
    const { container } = render(<MemberPortrait name="Harshith Chowdhary" games={['BGMI']} />)
    expect(screen.getByRole('img', { name: 'Harshith Chowdhary portrait' })).toBeInTheDocument()
    expect(container).toHaveTextContent('HC')
  })

  it('lights crew with no game in club violet', () => {
    const { container } = render(<MemberPortrait name="Koushik" games={['Other']} />)
    const stop = container.querySelector('radialGradient stop')
    expect(stop).toHaveAttribute('stop-color', '#9D4EDD')
  })
})
