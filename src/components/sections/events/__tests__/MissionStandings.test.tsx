import { render, screen } from '@testing-library/react'
import { MissionStandings } from '../MissionStandings'
import { LeaderboardEntry } from '@/types'

const entry = (over: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
  id: '1',
  event_name: 'Cyber Tournament',
  season: 'S1',
  rank: 1,
  player_name: 'Ghost',
  points: 120,
  game_type: 'BGMI',
  ...over,
})

describe('MissionStandings', () => {
  it('renders a row per entry with player and points', () => {
    render(
      <MissionStandings
        eventName="Cyber Tournament"
        entries={[entry(), entry({ id: '2', rank: 2, player_name: 'Vex', points: 95 })]}
      />
    )

    expect(screen.getByText('Ghost')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Vex')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
  })

  it('shows the team name when the sheet has one', () => {
    render(<MissionStandings eventName="Cyber Tournament" entries={[entry({ team_name: 'Nova Squad' })]} />)

    expect(screen.getByText('Nova Squad')).toBeInTheDocument()
  })

  it('labels the table with the event it belongs to', () => {
    render(<MissionStandings eventName="Cyber Tournament" entries={[entry()]} />)

    expect(screen.getByRole('table', { name: 'Cyber Tournament final standings' })).toBeInTheDocument()
  })

  it('renders nothing when there are no entries', () => {
    const { container } = render(<MissionStandings eventName="Cyber Tournament" entries={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
