'use client'

import { useEvents } from '@/hooks/useEvents'
import { splitEvents } from '@/lib/utils'
import { MissionCard } from './MissionCard'
import { DebriefRow } from './DebriefRow'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

/**
 * Mission select — upcoming dossiers + completed debrief log.
 */
export function MissionSelect() {
  const { data: events, loading, error, refetch } = useEvents()

  if (loading) {
    return (
      <div className="px-gutter pb-section max-w-6xl mx-auto grid gap-4" aria-busy="true" aria-label="Loading events">
        <SkeletonBlock className="h-52" />
        <SkeletonBlock className="h-52" />
        <SkeletonBlock className="h-24" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  const { upcoming, past } = splitEvents(events ?? [])

  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto">
      {/* Upcoming */}
      <section aria-labelledby="upcoming-heading" className="mb-24">
        <SectionReveal>
          <div className="flex items-baseline justify-between mb-8">
            <h2 id="upcoming-heading">
              <HudLabel live>ACTIVE MISSIONS // {String(upcoming.length).padStart(2, '0')}</HudLabel>
            </h2>
          </div>
        </SectionReveal>

        {upcoming.length > 0 ? (
          <div className="grid gap-5">
            {upcoming.map((event, i) => (
              <SectionReveal key={event.id} delay={i * 0.07}>
                <MissionCard event={event} index={i} />
              </SectionReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="NO ACTIVE MISSIONS // STANDBY"
            message="Nothing on the board right now. New battles drop here first."
          />
        )}
      </section>

      {/* Past */}
      <section aria-labelledby="past-heading">
        <SectionReveal>
          <div className="flex items-baseline justify-between mb-4">
            <h2 id="past-heading">
              <HudLabel>MISSION DEBRIEF // ARCHIVE</HudLabel>
            </h2>
            <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
              {String(past.length).padStart(2, '0')} LOGGED
            </span>
          </div>
        </SectionReveal>

        {past.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--line-1)' }}>
            {past.map((event, i) => (
              <SectionReveal key={event.id} delay={Math.min(i * 0.04, 0.3)}>
                <DebriefRow event={event} />
              </SectionReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="ARCHIVE EMPTY"
            message="No completed events yet — the history books open after the first battle."
          />
        )}
      </section>
    </div>
  )
}
