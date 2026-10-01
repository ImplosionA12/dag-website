'use client'

import { useEvents } from '@/hooks/useEvents'
import { getNextEvent, daysRemaining, formatDate, seasonTag, GAME_COLORS } from '@/lib/utils'
import { HudFrame } from '@/components/ui/HudFrame'
import { HudLabel } from '@/components/ui/HudLabel'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { GhostButton } from '@/components/ui/GhostButton'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { EventCover } from '@/components/ui/EventCover'

/**
 * "UP NEXT" — broadcast spotlight on the next open event. Between events it
 * replays the latest completed one, so the second scene on Home is never a
 * standby box.
 */
export function NextEventSpotlight() {
  const { data: events, loading } = useEvents()
  const nextEvent = events ? getNextEvent(events) : null
  const days = nextEvent ? daysRemaining(nextEvent.date) : null
  const lastEvent =
    !nextEvent && events
      ? events
          .filter(e => e.status === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null
      : null

  return (
    <section className="relative px-gutter py-section">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-baseline justify-between mb-10">
            <HudLabel live={Boolean(nextEvent)}>
              {nextEvent || !lastEvent ? 'UP NEXT // TRANSMISSION' : 'LATEST EVENT // REPLAY'}
            </HudLabel>
            {lastEvent && (
              <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
                NEXT EVENT TBA
              </span>
            )}
          </div>
        </SectionReveal>

        {loading ? (
          <div aria-busy="true" className="grid gap-3">
            <SkeletonBlock className="h-40" />
            <SkeletonBlock className="h-10 w-2/3" />
          </div>
        ) : nextEvent ? (
          <SectionReveal>
            <HudFrame accent className="p-8 md:p-14" tl="MISSION BRIEF" br={`SZN ${nextEvent.season}`}>
              <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <GameBadge game={nextEvent.game_type} size="md" />
                    <SeasonBadge season={nextEvent.season} />
                    <span className="type-label" style={{ color: 'var(--text-lo)' }}>
                      {nextEvent.event_type.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="type-display mb-5" style={{ color: 'var(--text-hi)' }}>
                    {nextEvent.event_name}
                  </h2>

                  <p className="type-body mb-8 max-w-xl" style={{ color: 'var(--text-mid)' }}>
                    {nextEvent.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5">
                    {nextEvent.status === 'open' && nextEvent.register_url && (
                      <GhostButton href={nextEvent.register_url}>REGISTER NOW</GhostButton>
                    )}
                    <span className="type-hud" style={{ color: 'var(--text-mid)' }}>
                      {formatDate(nextEvent.date)}
                    </span>
                  </div>
                </div>

                {/* Countdown block */}
                <div
                  className="flex flex-col items-center justify-center px-10 py-8 self-stretch"
                  style={{ borderLeft: `2px solid ${GAME_COLORS[nextEvent.game_type]}` }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-hud), monospace',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 'clamp(3.4rem, 8vw, 6rem)',
                      lineHeight: 1,
                      color: GAME_COLORS[nextEvent.game_type],
                    }}
                  >
                    {days === 0 ? 'NOW' : String(days).padStart(2, '0')}
                  </span>
                  <span className="type-label mt-3" style={{ color: 'var(--text-lo)' }}>
                    {days === 0 ? 'LIVE TODAY' : days === 1 ? 'DAY REMAINING' : 'DAYS REMAINING'}
                  </span>
                </div>
              </div>
            </HudFrame>
          </SectionReveal>
        ) : lastEvent ? (
          <SectionReveal>
            <HudFrame className="p-5 md:p-8" tl="COMPLETED" br={`SZN ${seasonTag(lastEvent.season)}`}>
              <div className="grid md:grid-cols-[1.25fr_1fr] gap-8 md:gap-12 items-center pt-4">
                <EventCover event={lastEvent} className="aspect-[16/9] md:order-2" />
                <div className="md:order-1 md:pl-4">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <GameBadge game={lastEvent.game_type} size="md" />
                    <span className="type-label" style={{ color: 'var(--text-lo)' }}>
                      {lastEvent.event_type.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="type-h2 mb-4" style={{ color: 'var(--text-hi)' }}>
                    {lastEvent.event_name}
                  </h2>
                  <p className="type-body mb-8 max-w-xl" style={{ color: 'var(--text-mid)' }}>
                    {lastEvent.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-5">
                    <GhostButton href="/leaderboards">SEE STANDINGS</GhostButton>
                    <span className="type-hud" style={{ color: 'var(--text-mid)' }}>
                      {formatDate(lastEvent.date)}
                    </span>
                  </div>
                </div>
              </div>
            </HudFrame>
          </SectionReveal>
        ) : (
          <SectionReveal>
            <EmptyState
              title="NO MISSION QUEUED // STANDBY"
              message="The next battle hasn't been scheduled yet. The ticker will light up when it is."
            />
          </SectionReveal>
        )}
      </div>
    </section>
  )
}
