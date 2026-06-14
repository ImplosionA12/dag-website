'use client'

import { LeaderboardEntry } from '@/types'
import { RankTag } from '@/components/ui/RankTag'
import { GameBadge } from '@/components/ui/GameBadge'
import { SectionReveal } from '@/components/ui/SectionReveal'

interface StandingsTableProps {
  /** Entries below the podium, already sorted by points desc */
  entries: LeaderboardEntry[]
  /** Position offset (podium size) so ranks continue from 4 */
  offset: number
}

/**
 * Broadcast standings rows — rank, player, event, game, tabular points.
 */
export function StandingsTable({ entries, offset }: StandingsTableProps) {
  if (entries.length === 0) return null

  return (
    <div role="table" aria-label="Season standings" style={{ borderTop: '1px solid var(--line-1)' }}>
      <div
        role="row"
        className="hidden md:grid grid-cols-[4rem_1fr_1fr_auto_6rem] gap-6 px-5 py-3"
        style={{ borderBottom: '1px solid var(--line-1)' }}
      >
        {['POS', 'PLAYER', 'EVENT', 'GAME', 'PTS'].map(h => (
          <span key={h} role="columnheader" className="type-label" style={{ color: 'var(--text-lo)' }}>
            {h}
          </span>
        ))}
      </div>

      {entries.map((entry, i) => (
        <SectionReveal key={entry.id} delay={Math.min(i * 0.04, 0.4)}>
          <div
            role="row"
            className="standings-row grid grid-cols-[3.2rem_1fr_auto] md:grid-cols-[4rem_1fr_1fr_auto_6rem] items-center gap-4 md:gap-6 px-3 md:px-5 py-4 transition-colors duration-150"
            style={{ borderBottom: '1px solid var(--line-1)' }}
          >
            <span role="cell">
              <RankTag rank={offset + i + 1} />
            </span>

            <span role="cell" className="min-w-0">
              <span className="type-body block truncate" style={{ color: 'var(--text-hi)', fontWeight: 500 }}>
                {entry.player_name}
              </span>
              {entry.team_name && (
                <span className="type-label" style={{ color: 'var(--text-lo)' }}>
                  {entry.team_name.toUpperCase()}
                </span>
              )}
            </span>

            <span
              role="cell"
              className="type-label hidden md:block truncate"
              style={{ color: 'var(--text-mid)' }}
            >
              {entry.event_name.toUpperCase()}
            </span>

            <span role="cell" className="hidden md:block">
              <GameBadge game={entry.game_type} />
            </span>

            <span
              role="cell"
              className="type-hud text-right"
              style={{ color: 'var(--text-hi)', fontWeight: 700 }}
            >
              {entry.points.toLocaleString()}
            </span>
          </div>
        </SectionReveal>
      ))}
    </div>
  )
}
