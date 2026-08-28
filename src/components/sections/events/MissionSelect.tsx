'use client'

import { useMemo, useState } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { GameType } from '@/types'
import { splitEvents, GAME_COLORS, GAME_LABELS } from '@/lib/utils'
import { MissionCard } from './MissionCard'
import { DebriefRow } from './DebriefRow'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

type Filter = 'ALL' | GameType

/**
 * Mission select — game filter tabs + search over upcoming dossiers and the
 * completed debrief log.
 *
 * Filtering happens before the upcoming/past split, so both section counts
 * reflect the active query. "No events at all" and "no events matching the
 * filter" are deliberately different empty states — the first is standby, the
 * second is a dead end the user can back out of.
 */
export function MissionSelect() {
  const { data: events, loading, error, refetch } = useEvents()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [query, setQuery] = useState('')

  const games = useMemo<Filter[]>(() => {
    if (!events) return ['ALL']
    return ['ALL', ...Array.from(new Set(events.map(e => e.game_type)))]
  }, [events])

  const matches = useMemo(() => {
    if (!events) return []
    const q = query.trim().toLowerCase()
    return events.filter(e => {
      if (filter !== 'ALL' && e.game_type !== filter) return false
      if (!q) return true
      return (
        e.event_name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.event_type.toLowerCase().includes(q)
      )
    })
  }, [events, filter, query])

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

  // Nothing in the feed at all — filters would be meaningless here.
  if (!events || events.length === 0) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <EmptyState
          title="NO DATA // STANDBY"
          message="No events on the board yet. New battles drop here first."
        />
      </div>
    )
  }

  const { upcoming, past } = splitEvents(matches)
  const filtering = filter !== 'ALL' || query.trim() !== ''

  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto">
      {/* Filter tabs + search */}
      <SectionReveal>
        <div className="mb-12">
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Filter events by game"
          >
            {games.map(g => {
              const active = filter === g
              const accent = g === 'ALL' ? 'var(--zone-accent)' : GAME_COLORS[g]
              return (
                <button
                  key={g}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(g)}
                  className="type-label px-4 py-2 transition-colors duration-150"
                  style={{
                    color: active ? 'var(--void)' : 'var(--text-mid)',
                    background: active ? accent : 'transparent',
                    border: `1px solid ${active ? accent : 'var(--line-2)'}`,
                  }}
                >
                  {g === 'ALL' ? 'ALL GAMES' : GAME_LABELS[g].toUpperCase()}
                </button>
              )
            })}

            <div className="relative ml-auto w-full sm:w-64">
              <label htmlFor="mission-search" className="sr-only">
                Search events
              </label>
              <input
                id="mission-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="SEARCH MISSIONS"
                className="type-label w-full px-3 py-2 outline-none transition-colors duration-150"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line-2)',
                  color: 'var(--text-hi)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--zone-accent)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--line-2)'
                }}
              />
            </div>
          </div>

          {filtering && (
            <div className="flex items-center gap-3 mt-4">
              <HudLabel>
                {String(matches.length).padStart(2, '0')} / {String(events.length).padStart(2, '0')} MISSIONS
              </HudLabel>
              <button
                onClick={() => {
                  setFilter('ALL')
                  setQuery('')
                }}
                className="type-label transition-colors duration-150"
                style={{ color: 'var(--zone-accent)' }}
              >
                CLEAR //
              </button>
            </div>
          )}
        </div>
      </SectionReveal>

      {/* Filters matched nothing — a dead end, not standby */}
      {matches.length === 0 ? (
        <EmptyState
          title="NO MATCH // ADJUST FILTERS"
          message="No missions match that search. Clear the filters to see the full board."
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
