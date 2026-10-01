'use client'

import Link from 'next/link'
import { Event } from '@/types'
import { eventSlug, formatDate } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'
import { EventCover } from '@/components/ui/EventCover'

interface DebriefCardProps {
  event: Event
}

/**
 * Completed event in the archive — cover art first, so the history reads as a
 * wall of posters rather than a ledger. The title link stretches over the whole
 * card; the recording link sits above it so both stay clickable.
 */
export function DebriefCard({ event }: DebriefCardProps) {
  return (
    <article className="debrief-card group relative flex flex-col h-full" style={{ border: '1px solid var(--line-1)' }}>
      <div className="overflow-hidden">
        <EventCover event={event} className="debrief-cover aspect-[16/9]" />
      </div>

      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-center justify-between gap-3">
          <GameBadge game={event.game_type} />
          <span className="type-hud" style={{ color: 'var(--text-lo)', fontSize: '0.68rem' }}>
            {formatDate(event.date)}
          </span>
        </div>

        <h3 className="type-h3" style={{ fontSize: '1.25rem', color: 'var(--text-hi)' }}>
          <Link href={`/events/${eventSlug(event)}`} className="mission-link stretched-link">
            {event.event_name}
          </Link>
        </h3>

        {event.recording_url && (
          <a
            href={event.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link type-label relative z-10 mt-auto self-start"
          >
            WATCH RECORDING
          </a>
        )}
      </div>
    </article>
  )
}
