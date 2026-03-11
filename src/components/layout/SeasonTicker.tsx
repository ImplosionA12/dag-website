'use client'

import { useEvents } from '@/hooks/useEvents'
import { getNextEvent, daysRemaining, formatDate } from '@/lib/utils'
import { DATA_CONFIG } from '@/config/data'

function buildTickerContent(text: string): string {
  // Repeat twice so the marquee seamlessly loops
  const segment = `◆ ${text}  ·  `
  return segment.repeat(8)
}

export function SeasonTicker() {
  const { data: events } = useEvents()

  let tickerText: string

  if (events && events.length > 0) {
    const nextEvent = getNextEvent(events)
    const totalEvents = events.length
    const season = DATA_CONFIG.club.currentSeason

    if (nextEvent) {
      const days = daysRemaining(nextEvent.date)
      const daysStr = days === 0 ? 'TODAY' : days === 1 ? '1 DAY' : `${days} DAYS`
      tickerText = [
        `SEASON ${season} ACTIVE`,
        `NEXT: ${nextEvent.event_name.toUpperCase()} — ${daysStr}`,
        `DATE: ${formatDate(nextEvent.date)}`,
        `TOTAL EVENTS: ${totalEvents}`,
        `SEASON ${season} ACTIVE`,
        `NEXT: ${nextEvent.event_name.toUpperCase()} — ${daysStr}`,
        `DATE: ${formatDate(nextEvent.date)}`,
        `TOTAL EVENTS: ${totalEvents}`,
      ].join('  ·  ')
    } else {
      tickerText = [
        `SEASON ${season} ACTIVE`,
        `TOTAL EVENTS: ${totalEvents}`,
        `ALL BATTLES COMPLETED`,
        `SEASON ${season} ACTIVE`,
        `TOTAL EVENTS: ${totalEvents}`,
        `ALL BATTLES COMPLETED`,
      ].join('  ·  ')
    }
  } else {
    // Fallback — no data loaded yet
    tickerText = [
      'DAG — DRUSHYA GAMING & ANIMATIONS',
      'SEASON 1 — COMING SOON',
      'WHERE GAMING MEETS ANIMATION',
      'DAG — DRUSHYA GAMING & ANIMATIONS',
      'SEASON 1 — COMING SOON',
      'WHERE GAMING MEETS ANIMATION',
    ].join('  ·  ')
  }

  const content = buildTickerContent(tickerText)

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
      role="region"
      aria-label="Season status ticker"
      style={{
        height: 'var(--ticker-height)',
        backgroundColor: 'var(--bg-void)',
        borderTop: '1px solid rgba(255,183,3,0.3)',
        borderBottom: '1px solid rgba(255,183,3,0.1)',
      }}
    >
      <div
        className="animate-marquee h-full flex items-center"
        style={{ width: 'max-content' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: 'var(--gold-core)',
            whiteSpace: 'nowrap',
          }}
        >
          {content}
        </span>
      </div>
    </div>
  )
}
