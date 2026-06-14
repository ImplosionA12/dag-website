'use client'

import { useEvents } from '@/hooks/useEvents'
import { getNextEvent, daysRemaining, formatDate, GAME_COLORS } from '@/lib/utils'
import { HudFrame } from '@/components/ui/HudFrame'
import { HudLabel } from '@/components/ui/HudLabel'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { GhostButton } from '@/components/ui/GhostButton'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

/**
 * "UP NEXT" — broadcast spotlight on the next open event.
 */
export function NextEventSpotlight() {
  const { data: events, loading } = useEvents()
  const nextEvent = events ? getNextEvent(events) : null
  const days = nextEvent ? daysRemaining(nextEvent.date) : null

  return (
    <section
      className="relative px-gutter py-section"
      style={{
        background:
          'linear-gradient(180deg, var(--void) 0%, var(--surface-1) 50%, var(--void) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-baseline justify-between mb-10">
            <HudLabel live>UP NEXT // TRANSMISSION</HudLabel>
            <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
              FEED 02
            </span>
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
