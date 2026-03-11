'use client'

import Link from 'next/link'
import { Event } from '@/types'
import { formatDate, daysRemaining, GAME_COLORS } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { NeonButton } from '@/components/ui/NeonButton'
import { GlassButton } from '@/components/ui/GlassButton'

interface EventCardProps {
  event: Event
  variant?: 'upcoming' | 'past'
}

function StatusDot({ status }: { status: Event['status'] }) {
  if (status === 'open') {
    return (
      <span className="inline-flex items-center gap-2 text-label" style={{ color: '#4ade80' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'neonPulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px #4ade80' }} />
        OPEN
      </span>
    )
  }
  if (status === 'closed') {
    return (
      <span className="inline-flex items-center gap-2 text-label" style={{ color: '#f87171' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
        CLOSED
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 text-label" style={{ color: 'var(--text-muted)' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
      COMPLETED
    </span>
  )
}

function EventTypeBadge({ type }: { type: 'workshop' | 'screening' }) {
  return (
    <span
      className="inline-flex items-center rounded-sm font-medium tracking-widest px-2 py-0.5 text-[0.6rem]"
      style={{
        backgroundColor: 'rgba(123,47,190,0.18)',
        border: '1px solid rgba(157,78,221,0.5)',
        color: 'var(--violet-bright)',
        fontFamily: 'var(--font-orbitron), monospace',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {type === 'workshop' ? 'WORKSHOP' : 'SCREENING'}
    </span>
  )
}

function RecordingLink({ url, compact }: { url: string; compact?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--gold-core)',
        textDecoration: 'none',
        border: '1px solid rgba(255,183,3,0.35)',
        borderRadius: '2px',
        padding: compact ? '0.35rem 0.75rem' : '0.5rem 1rem',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
    >
      ▶ ACCESS RECORDING
    </a>
  )
}

export function EventCard({ event, variant = 'upcoming' }: EventCardProps) {
  const isWorkshop = event.event_type === 'workshop' || event.event_type === 'screening'
  const gameColor = GAME_COLORS[event.game_type] ?? GAME_COLORS['Other']
  const days = daysRemaining(event.date)
  // Workshops always get full-opacity glass styling regardless of past/upcoming
  const isPast = variant === 'past' && !isWorkshop
  const accentColor = isWorkshop ? 'var(--violet-core)' : gameColor

  return (
    <div
      className="relative rounded-lg overflow-hidden liquid-glass transition-all duration-300"
      style={{
        borderLeft: `4px solid ${accentColor}`,
        border: `1px solid rgba(157,78,221,${isPast ? '0.1' : '0.18'})`,
        borderLeftColor: accentColor,
        borderLeftWidth: '4px',
        background: isPast ? 'rgba(10,8,18,0.6)' : 'var(--bg-secondary)',
        opacity: isPast ? 0.75 : 1,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: isWorkshop
            ? 'radial-gradient(ellipse 80% 100% at 90% 50%, rgba(123,47,190,0.06) 0%, transparent 70%)'
            : `radial-gradient(ellipse 80% 100% at 90% 50%, ${gameColor}06 0%, transparent 70%)`,
        }}
      />

      <div className={`relative ${isPast ? 'p-5 md:p-6' : 'p-6 md:p-8'}`}>
        {/* Top row: type badge + season + status */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {isWorkshop
            ? <EventTypeBadge type={event.event_type as 'workshop' | 'screening'} />
            : <GameBadge game={event.game_type} size="sm" />
          }
          <SeasonBadge season={event.season} />
          <StatusDot status={event.status} />
        </div>

        {/* Event name */}
        <h3
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 700,
            fontSize: isPast ? 'clamp(1.1rem, 2vw, 1.4rem)' : 'clamp(1.4rem, 3vw, 2rem)',
            color: isPast ? 'var(--text-secondary)' : 'var(--text-primary)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          {event.event_name}
        </h3>

        {/* Date */}
        <p
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: isPast ? 'var(--text-muted)' : 'var(--gold-core)',
            marginBottom: '0.75rem',
          }}
        >
          {formatDate(event.date)}
          {!isPast && days !== null && days <= 7 && days > 0 && (
            <span style={{ color: '#f87171', marginLeft: '1rem' }}>
              {days} DAY{days === 1 ? '' : 'S'} LEFT
            </span>
          )}
          {!isPast && days === 0 && (
            <span style={{ color: '#4ade80', marginLeft: '1rem' }}>TODAY</span>
          )}
        </p>

        {/* Description — always shown for workshops, upcoming-only for tournaments */}
        {(isWorkshop || !isPast) && event.description && (
          <p
            className="text-body mb-6"
            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
          >
            {event.description}
          </p>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}

        {/* Workshops: ACCESS RECORDING if url, otherwise nothing */}
        {isWorkshop && event.status === 'completed' && event.recording_url && (
          <RecordingLink url={event.recording_url} compact={variant === 'past'} />
        )}

        {/* Workshops: upcoming/open */}
        {isWorkshop && event.status === 'open' && (
          <NeonButton href={event.register_url || '#'} size="sm" pulse={false}>
            REGISTER NOW
          </NeonButton>
        )}

        {/* Tournaments: upcoming CTAs */}
        {!isWorkshop && !isPast && (
          <div>
            {event.status === 'open' && (
              <NeonButton href={event.register_url || '#'} size="sm" pulse={false}>
                REGISTER NOW
              </NeonButton>
            )}
            {event.status === 'closed' && (
              <GlassButton disabled size="sm">REGISTRATION CLOSED</GlassButton>
            )}
            {event.status === 'completed' && event.recording_url && (
              <RecordingLink url={event.recording_url} />
            )}
            {event.status === 'completed' && !event.recording_url && (
              <GlassButton href={`/leaderboards?event=${event.id}`} size="sm">
                VIEW RESULTS →
              </GlassButton>
            )}
          </div>
        )}

        {/* Tournaments: past CTA */}
        {!isWorkshop && isPast && event.status === 'completed' && (
          <Link
            href={`/leaderboards?event=${event.id}`}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--violet-bright)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
          >
            VIEW RESULTS →
          </Link>
        )}
      </div>
    </div>
  )
}
