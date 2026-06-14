'use client'

import { useMemo, useState } from 'react'
import { useLeaderboards } from '@/hooks/useLeaderboards'
import { GameType } from '@/types'
import { GAME_COLORS, GAME_LABELS } from '@/lib/utils'
import { Podium } from './Podium'
import { StandingsTable } from './StandingsTable'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

type Filter = 'ALL' | GameType

/**
 * Broadcast standings — game filter tabs, podium top-3, table for the rest.
 * Entries are ranked by points within the active filter.
 */
export function BroadcastStandings() {
  const { data: entries, loading, error, refetch } = useLeaderboards()
  const [filter, setFilter] = useState<Filter>('ALL')

  const games = useMemo<Filter[]>(() => {
    if (!entries) return ['ALL']
    const present = Array.from(new Set(entries.map(e => e.game_type)))
    return ['ALL', ...present]
  }, [entries])

  const ranked = useMemo(() => {
    if (!entries) return []
    const filtered = filter === 'ALL' ? entries : entries.filter(e => e.game_type === filter)
    return [...filtered].sort((a, b) => b.points - a.points)
  }, [entries, filter])

  if (loading) {
    return (
      <div className="px-gutter pb-section max-w-5xl mx-auto" aria-busy="true" aria-label="Loading standings">
        <SkeletonBlock className="h-10 w-72 mb-10" />
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <SkeletonBlock className="h-56" />
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-52" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-14 mb-1" />
        ))}
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

  if (!entries || entries.length === 0) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <EmptyState
          title="STANDINGS OFFLINE // STANDBY"
          message="No results posted yet. The board lights up after the first event."
        />
      </div>
    )
  }

  const top = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="px-gutter pb-section max-w-5xl mx-auto">
      {/* Filter tabs */}
      <SectionReveal>
        <div
          className="flex flex-wrap items-center gap-2 mb-12"
          role="tablist"
          aria-label="Filter standings by game"
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
          <HudLabel className="ml-auto hidden sm:flex">
            {String(ranked.length).padStart(2, '0')} COMPETITORS
          </HudLabel>
        </div>
      </SectionReveal>

      {ranked.length === 0 ? (
        <EmptyState
          title="NO RESULTS FOR THIS GAME"
          message="Nobody has posted points here yet. First blood pending."
        />
      ) : (
        <>
          <Podium top={top} />
          <StandingsTable entries={rest} offset={top.length} />
        </>
      )}
    </div>
  )
}
