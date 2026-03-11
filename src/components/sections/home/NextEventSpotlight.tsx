'use client'

import Link from 'next/link'
import { useEvents } from '@/hooks/useEvents'
import { getNextEvent, daysRemaining, formatDate, GAME_COLORS } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { NeonButton } from '@/components/ui/NeonButton'

export function NextEventSpotlight() {
  const { data: events, loading } = useEvents()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="px-6 md:px-10 py-section max-w-7xl mx-auto">
        <div className="skeleton rounded-lg" style={{ height: '280px' }} />
      </section>
    )
  }

  const nextEvent = events ? getNextEvent(events) : null

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!nextEvent) {
    return (
      <section className="px-6 md:px-10 py-section max-w-7xl mx-auto">
        <p className="text-label mb-4" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
          NEXT EVENT
        </p>
        <div
          className="rounded-lg p-10 text-center"
          style={{
            border: '1px dashed rgba(157,78,221,0.25)',
            background: 'rgba(123,47,190,0.04)',
          }}
        >
          <p className="text-section-heading" style={{ color: 'var(--text-muted)' }}>
            THE NEXT BATTLE IS BEING PLANNED
          </p>
          <p className="text-body mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Stay tuned — Season {events && events.length > 0 ? '1' : '1'} events are coming.
          </p>
        </div>
      </section>
    )
  }

  const days = daysRemaining(nextEvent.date)
  const gameColor = GAME_COLORS[nextEvent.game_type]
  const daysLabel = days === 0 ? 'TODAY' : days === 1 ? '1 DAY REMAINING' : `${days} DAYS REMAINING`

  return (
    <section className="px-6 md:px-10 py-section max-w-7xl mx-auto">
      <p className="text-label mb-6" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
        NEXT EVENT
      </p>

      <div
        className="relative rounded-lg overflow-hidden liquid-glass"
        style={{
          borderLeft: `4px solid ${gameColor}`,
          border: `1px solid rgba(157,78,221,0.18)`,
          borderLeftColor: gameColor,
          borderLeftWidth: '4px',
          background: 'var(--bg-secondary)',
          boxShadow: `0 0 40px rgba(123,47,190,0.08), 0 0 0 1px rgba(157,78,221,0.1)`,
        }}
      >
        {/* Background game glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 80% 50%, ${gameColor}08 0%, transparent 70%)`,
          }}
          aria-hidden
        />

        <div className="relative p-8 md:p-12">
          {/* Top row: badges + status */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <GameBadge game={nextEvent.game_type} size="md" />
            <SeasonBadge season={nextEvent.season} />
            {nextEvent.status === 'open' && (
              <span
                className="inline-flex items-center gap-2 text-label"
                style={{ color: '#4ade80' }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    display: 'inline-block',
                    animation: 'neonPulse 1.5s ease-in-out infinite',
                    boxShadow: '0 0 6px #4ade80',
                  }}
                />
                OPEN
              </span>
            )}
          </div>

          {/* Event name */}
          <h2
            className="text-section-heading mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {nextEvent.event_name}
          </h2>

          {/* Countdown */}
          <p
            className="text-data-bold mb-2"
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              color: 'var(--gold-core)',
              letterSpacing: '0.08em',
            }}
          >
            {daysLabel}
          </p>

          {/* Date */}
          <p
            className="text-label mb-6"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}
          >
            {formatDate(nextEvent.date)}
          </p>

          {/* Description */}
          <p
            className="text-body mb-8"
            style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}
          >
            {nextEvent.description}
          </p>

          {/* CTA */}
          {nextEvent.status === 'open' && nextEvent.register_url ? (
            <NeonButton href={nextEvent.register_url} size="md" pulse={false}>
              REGISTER NOW
            </NeonButton>
          ) : nextEvent.status === 'closed' ? (
            <span
              className="text-label px-6 py-3"
              style={{
                color: 'var(--text-muted)',
                border: '1px solid rgba(74,67,88,0.4)',
                borderRadius: '2px',
              }}
            >
              REGISTRATION CLOSED
            </span>
          ) : (
            <Link
              href={`/leaderboards?event=${nextEvent.id}`}
              className="text-label px-6 py-3"
              style={{
                color: 'var(--violet-bright)',
                border: '1px solid rgba(157,78,221,0.35)',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              VIEW RESULTS →
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
