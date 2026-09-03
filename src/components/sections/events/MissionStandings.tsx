import { LeaderboardEntry } from '@/types'
import { RankTag } from '@/components/ui/RankTag'

interface MissionStandingsProps {
  entries: LeaderboardEntry[]
  /** Event name, for the table's accessible label */
  eventName: string
}

/**
 * Final standings for a single mission — rank, player, team, points.
 *
 * Deliberately not the season StandingsTable: that one carries an EVENT column and a
 * podium offset, both meaningless inside one event's own dossier.
 */
export function MissionStandings({ entries, eventName }: MissionStandingsProps) {
  if (entries.length === 0) return null

  return (
    <div role="table" aria-label={`${eventName} final standings`}>
      <div
        role="row"
        className="hidden md:grid grid-cols-[4rem_1fr_auto] gap-6 px-5 py-3"
        style={{ borderBottom: '1px solid var(--line-1)' }}
      >
        {['POS', 'PLAYER', 'PTS'].map(h => (
          <span key={h} role="columnheader" className="type-label" style={{ color: 'var(--text-lo)' }}>
            {h}
          </span>
        ))}
      </div>

      {entries.map(entry => (
        <div
          key={entry.id}
          role="row"
          className="standings-row grid grid-cols-[3.2rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-center gap-4 md:gap-6 px-3 md:px-5 py-4 transition-colors duration-150"
          style={{ borderBottom: '1px solid var(--line-1)' }}
        >
          <span role="cell">
            <RankTag rank={entry.rank} />
          </span>

          <span role="cell" className="min-w-0">
            <span className="type-body block truncate" style={{ color: 'var(--text-hi)', fontWeight: 500 }}>
              {entry.player_name}
            </span>
            {entry.team_name && (
              <span className="type-label block truncate" style={{ color: 'var(--text-lo)' }}>
                {entry.team_name}
              </span>
            )}
          </span>

          <span
            role="cell"
            className="type-hud text-right"
            style={{ color: 'var(--text-hi)', fontVariantNumeric: 'tabular-nums' }}
          >
            {entry.points}
          </span>
        </div>
      ))}
    </div>
  )
}
