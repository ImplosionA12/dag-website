'use client'

import { useMemo } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { getNextEvent, daysRemaining, formatDate } from '@/lib/utils'
import { DATA_CONFIG } from '@/config/data'

function buildTickerContent(text: string): string {
  // Repeat so the 50%-translate marquee loops seamlessly
  const segment = `${text}  //  `
  return segment.repeat(8)
}

export function SeasonTicker() {
  const { data: events } = useEvents()

  const content = useMemo(() => {
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
        ].join('  //  ')
      } else {
        tickerText = [
          `SEASON ${season} ACTIVE`,
          `TOTAL EVENTS: ${totalEvents}`,
          `ALL BATTLES COMPLETED`,
        ].join('  //  ')
      }
    } else {
      tickerText = [
        'DAG — DRUSHYA ANIMATIONS & GAMING',
        `SEASON ${DATA_CONFIG.club.currentSeason.replace('S', '')} — COMING SOON`,
        'WHERE GAMING MEETS ANIMATION',
      ].join('  //  ')
    }

    return buildTickerContent(tickerText)
  }, [events])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-ticker flex overflow-hidden"
      role="region"
      aria-label="Season status ticker"
      style={{
        height: 'var(--ticker-h)',
        backgroundColor: 'var(--void)',
        borderBottom: '1px solid var(--line-1)',
      }}
    >
      {/* Fixed broadcast cell — LIVE indicator (above the marquee layer) */}
      <div
        className="relative z-10 flex items-center gap-2 px-4 flex-shrink-0"
        style={{ borderRight: '1px solid var(--line-1)', background: 'var(--surface-1)' }}
      >
        <span
          className="animate-flicker"
          aria-hidden="true"
          style={{ width: 6, height: 6, background: 'var(--game-valorant)', borderRadius: '50%' }}
        />
        <span
          className="type-label"
          style={{ color: 'var(--text-hi)', whiteSpace: 'nowrap' }}
        >
          LIVE // SZN {DATA_CONFIG.club.currentSeason.replace('S', '0')}
        </span>
      </div>

      {/* Scrolling telemetry — clipped so the transform can't slide over the cell */}
      <div className="flex-1 h-full overflow-hidden">
        <div className="animate-marquee h-full flex items-center" style={{ width: 'max-content' }}>
          <span
            style={{
              fontFamily: 'var(--font-hud), monospace',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: 'var(--text-mid)',
              whiteSpace: 'nowrap',
              paddingLeft: '1rem',
            }}
          >
            {content}
          </span>
        </div>
      </div>
    </div>
  )
}
