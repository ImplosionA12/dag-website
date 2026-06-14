'use client'

import { LeaderboardEntry } from '@/types'
import { getRankColor } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'
import { StatCounter } from '@/components/ui/StatCounter'
import { SectionReveal } from '@/components/ui/SectionReveal'

interface PodiumProps {
  /** Top three entries, already sorted by points desc */
  top: LeaderboardEntry[]
}

interface PodiumBlockProps {
  entry: LeaderboardEntry
  position: number
  delay: number
}

function PodiumBlock({ entry, position, delay }: PodiumBlockProps) {
  const isFirst = position === 1
  const color = getRankColor(position)
  const height = isFirst ? 'md:pt-10 md:pb-14' : position === 2 ? 'md:pt-16 md:pb-10' : 'md:pt-20 md:pb-8'

  return (
    <SectionReveal delay={delay} className={isFirst ? 'md:order-2' : position === 2 ? 'md:order-1' : 'md:order-3'}>
      <div
        className={`relative flex flex-col items-center text-center px-6 pt-8 pb-8 ${height} ${
          isFirst ? 'animate-pulse-gold' : ''
        }`}
        style={{
          background: isFirst ? 'rgba(255,183,3,0.05)' : 'var(--surface-1)',
          border: `1px solid ${isFirst ? 'var(--gold-400)' : 'var(--line-1)'}`,
        }}
      >
        <span
          className="type-hud-lg"
          style={{ color, fontWeight: 700 }}
          aria-label={`Position ${position}`}
        >
          {isFirst ? '01 // CHAMPION' : `0${position}`}
        </span>

        <p
          className="mt-4 mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: isFirst ? 'clamp(1.8rem, 3.4vw, 2.6rem)' : 'clamp(1.4rem, 2.6vw, 2rem)',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: 'var(--text-hi)',
          }}
        >
          {entry.player_name}
        </p>

        {entry.team_name && (
          <p className="type-label mb-2" style={{ color: 'var(--text-lo)' }}>
            {entry.team_name.toUpperCase()}
          </p>
        )}

        <GameBadge game={entry.game_type} className="my-3" />

        <StatCounter value={entry.points} label="POINTS" />
      </div>
    </SectionReveal>
  )
}

/**
 * Broadcast podium — silver / GOLD / bronze blocks, champion center-stage.
 */
export function Podium({ top }: PodiumProps) {
  if (top.length === 0) return null

  return (
    <div className="grid md:grid-cols-3 gap-4 items-end mb-16">
      {top.map((entry, i) => (
        <PodiumBlock key={entry.id} entry={entry} position={i + 1} delay={i * 0.1} />
      ))}
    </div>
  )
}
