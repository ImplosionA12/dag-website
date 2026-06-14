'use client'

import { HallOfFameEntry, HoFCategory } from '@/types'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { HudFrame } from '@/components/ui/HudFrame'

interface TrophyCardProps {
  category: HoFCategory
  icon: string
  description: string
  entry: HallOfFameEntry | null
  index: number
}

/**
 * Hall of Fame plaque. Claimed = gold-framed trophy; unclaimed = a dark
 * outlined slot — "UNCLAIMED" is a designed absence, not an error.
 */
export function TrophyCard({ category, icon, description, entry, index }: TrophyCardProps) {
  const claimed = Boolean(entry && entry.player_name)

  if (!claimed) {
    return (
      <div
        className="relative flex flex-col p-8 h-full"
        style={{
          border: '1px dashed var(--line-2)',
          background: 'var(--surface-1)',
          minHeight: 280,
        }}
      >
        <span className="type-label mb-6" style={{ color: 'var(--text-lo)' }}>
          TROPHY {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-3xl mb-4 opacity-30 grayscale" aria-hidden="true">
          {icon}
        </span>
        <h3 className="type-h3 mb-3" style={{ color: 'var(--text-mid)' }}>
          {category}
        </h3>
        <p className="type-body mb-6" style={{ color: 'var(--text-lo)', fontSize: '0.84rem' }}>
          {description}
        </p>
        <span className="type-label mt-auto" style={{ color: 'var(--text-lo)', letterSpacing: '0.26em' }}>
          UNCLAIMED // SZN 01
        </span>
      </div>
    )
  }

  return (
    <HudFrame
      accent
      className="trophy-card relative flex flex-col p-8 h-full transition-transform duration-300"
      tl={`TROPHY ${String(index + 1).padStart(2, '0')}`}
    >
      {/* Gold wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,183,3,0.08) 0%, transparent 70%)',
        }}
      />

      <span className="text-3xl mb-4 mt-4" aria-hidden="true">
        {icon}
      </span>

      <h3 className="type-h3 mb-1" style={{ color: 'var(--gold-400)' }}>
        {category}
      </h3>

      <p
        className="mb-3"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          textTransform: 'uppercase',
          lineHeight: 1,
          color: 'var(--text-hi)',
        }}
      >
        {entry!.player_name}
      </p>

      <p className="type-body mb-6" style={{ color: 'var(--text-mid)', fontSize: '0.86rem' }}>
        {entry!.description || description}
      </p>

      <div className="mt-auto flex items-center gap-2.5">
        <GameBadge game={entry!.game_type} />
        <SeasonBadge season={entry!.season} />
      </div>
    </HudFrame>
  )
}
