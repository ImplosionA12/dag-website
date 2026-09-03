'use client'

import Link from 'next/link'
import { Event } from '@/types'
import { eventSlug, formatDate, GAME_COLORS } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'

interface DebriefRowProps {
  event: Event
}

/**
 * Completed event — condensed "MISSION COMPLETE" debrief row.
 */
export function DebriefRow({ event }: DebriefRowProps) {
  return (
    <div
      className="debrief-row group grid grid-cols-[auto_1fr_auto] md:grid-cols-[7rem_1fr_auto_auto] items-center gap-4 md:gap-8 px-5 md:px-7 py-5 transition-colors duration-200"
      style={{ borderBottom: '1px solid var(--line-1)' }}
    >
      <span className="type-hud hidden md:block" style={{ color: 'var(--text-lo)', fontSize: '0.68rem' }}>
        {formatDate(event.date)}
      </span>

      <div className="min-w-0">
        <p className="type-h3 truncate" style={{ fontSize: '1.1rem' }}>
          <Link
            href={`/events/${eventSlug(event)}`}
            className="mission-link"
            style={{ color: 'var(--text-mid)' }}
          >
            {event.event_name}
          </Link>
        </p>
        <span className="type-label md:hidden" style={{ color: 'var(--text-lo)' }}>
          {formatDate(event.date)}
        </span>
      </div>

      <GameBadge game={event.game_type} />

      <div className="flex items-center gap-4">
        <span
          className="type-label hidden sm:inline-flex items-center gap-2"
          style={{ color: GAME_COLORS[event.game_type] }}
        >
          <span aria-hidden="true" style={{ width: 5, height: 5, background: 'currentColor', display: 'inline-block' }} />
          COMPLETE
        </span>
        {event.recording_url && (
          <a
            href={event.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link type-label"
          >
            WATCH ▸
          </a>
        )}
      </div>
    </div>
  )
}
