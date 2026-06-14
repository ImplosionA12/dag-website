import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '../ErrorState'

describe('ErrorState', () => {
  it('renders the SIGNAL LOST headline', () => {
    render(<ErrorState />)
    expect(screen.getByText('SIGNAL LOST')).toBeInTheDocument()
  })

  it('renders a custom message', () => {
    render(<ErrorState message="The events feed dropped." />)
    expect(screen.getByText('The events feed dropped.')).toBeInTheDocument()
  })

  it('fires onRetry from the reconnect button', () => {
    const onRetry = jest.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByText('RECONNECT'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('omits the reconnect button without onRetry', () => {
    render(<ErrorState />)
    expect(screen.queryByText('RECONNECT')).not.toBeInTheDocument()
  })
})
