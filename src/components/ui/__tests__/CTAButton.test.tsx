import { render, screen, fireEvent } from '@testing-library/react'
import { CTAButton } from '../CTAButton'

describe('CTAButton', () => {
  it('renders its label', () => {
    render(<CTAButton onClick={() => {}}>JOIN THE CLUB</CTAButton>)
    expect(screen.getByText('JOIN THE CLUB')).toBeInTheDocument()
  })

  it('renders as a button and fires onClick', () => {
    const onClick = jest.fn()
    render(<CTAButton onClick={onClick}>GO</CTAButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an internal href as a link', () => {
    render(<CTAButton href="/events">EVENTS</CTAButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/events')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders an external href with new-tab + noopener', () => {
    render(<CTAButton href="https://example.com/form">VOTE</CTAButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/form')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('is magnetic for the custom cursor', () => {
    render(<CTAButton href="/events">EVENTS</CTAButton>)
    expect(screen.getByRole('link')).toHaveAttribute('data-magnetic')
  })
})
