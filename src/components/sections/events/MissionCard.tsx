'use client'

import Link from 'next/link'
import { Event } from '@/types'
import { daysRemaining, eventSlug, formatDate, GAME_COLORS } from '@/lib/utils'
import { HudFrame } from '@/components/ui/HudFrame'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { GhostButton } from '@/components/ui/GhostButton'

interface MissionCardProps {
  event: Event
  index: number
}

/**
 * Upcoming event dossier — mission-select card with game-accent edge,
 * countdown readout, and register CTA for open events.
 */
export function MissionCard({ event, index }: MissionCardProps) {
  const days = daysRemaining(event.date)
  const accent = GAME_COLORS[event.game_type]
  const isOpen = event.status === 'open'

  return (
    <HudFrame
      className="mission-card relative p-7 md:p-10 transition-transform duration-300"
      tl={`MISSION ${String(index + 1).padStart(2, '0')}`}
      br={event.event_type.toUpperCase()}
    >
      {/* Game accent edge */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 bottom-3"
        style={{ width: 2, background: accent }}
      />

      <div className="grid md:grid-cols-[auto_1fr_auto] gap-7 md:gap-10 items-center pt-4">
        {/* Countdown */}
        <div className="flex md:flex-col items-baseline md:items-center gap-2 md:w-24">
          <span
            style={{
              fontFamily: 'var(--font-hud), monospace',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              lineHeight: 1,
              color: accent,
            }}
          >
            {days === null ? '—' : days === 0 ? 'NOW' : String(days).padStart(2, '0')}
          </span>
          <span className="type-label" style={{ color: 'var(--text-lo)' }}>
            {days === 0 ? 'TODAY' : days === 1 ? 'DAY' : 'DAYS'}
          </span>
        </div>

        {/* Brief */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <GameBadge game={event.game_type} />
            <SeasonBadge season={event.season} />
            <span
              className="type-label px-2 py-0.5"
              style={{
                color: isOpen ? 'var(--void)' : 'var(--text-mid)',
                background: isOpen ? accent : 'transparent',
                border: isOpen ? 'none' : '1px solid var(--line-2)',
              }}
            >
              {isOpen ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED'}
            </span>
          </div>

          <h3 className="type-h3 mb-3">
            <Link
              href={`/events/${eventSlug(event)}`}
              className="mission-link"
              style={{ color: 'var(--text-hi)' }}
            >
              {event.event_name}
            </Link>
          </h3>
          <p className="type-body mb-2 max-w-xl" style={{ color: 'var(--text-mid)', fontSize: '0.88rem' }}>
            {event.description}
          </p>
          <span className="type-hud" style={{ color: 'var(--text-lo)', fontSize: '0.7rem' }}>
            {formatDate(event.date)}
          </span>
        </div>

        {/* Action */}
        <div className="flex md:justify-end">
          {isOpen && event.register_url ? (
            <GhostButton href={event.register_url}>DEPLOY</GhostButton>
          ) : (
            <GhostButton href={`/events/${eventSlug(event)}`}>BRIEF</GhostButton>
          )}
        </div>
      </div>
    </HudFrame>
  )
}
