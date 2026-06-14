import { render, screen, fireEvent } from '@testing-library/react'
import { GhostButton } from '../GhostButton'

describe('GhostButton', () => {
  it('renders its label', () => {
    render(<GhostButton onClick={() => {}}>RECONNECT</GhostButton>)
    expect(screen.getByText('RECONNECT')).toBeInTheDocument()
  })

  it('fires onClick when rendered as a button', () => {
    const onClick = jest.fn()
    render(<GhostButton onClick={onClick}>RETRY</GhostButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders internal links without target', () => {
    render(<GhostButton href="/leaderboards">BOARD</GhostButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/leaderboards')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders external links in a new tab', () => {
    render(<GhostButton href="https://forms.example.com">REGISTER</GhostButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
