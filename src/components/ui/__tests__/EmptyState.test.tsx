import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders the default standby copy', () => {
    render(<EmptyState />)
    expect(screen.getByText('NO DATA // STANDBY')).toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(<EmptyState title="ARCHIVE EMPTY" message="Nothing logged yet." />)
    expect(screen.getByText('ARCHIVE EMPTY')).toBeInTheDocument()
    expect(screen.getByText('Nothing logged yet.')).toBeInTheDocument()
  })
})
