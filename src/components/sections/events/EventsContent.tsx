'use client'

import { useState, useMemo } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { splitEvents } from '@/lib/utils'
import { EventCard } from './EventCard'
import { StackScrollCards } from './StackScrollCards'
import { GameType } from '@/types'
import { DATA_CONFIG } from '@/config/data'

const GAME_LABELS: Record<GameType, string> = {
  FF:       'FREE FIRE',
  BGMI:     'BGMI',
  Valorant: 'VALORANT',
  Anime:    'ANIME',
  Other:    'OTHER',
}

function SkeletonCard({ tall }: { tall?: boolean }) {
  return <div className="skeleton rounded-lg" style={{ height: tall ? '260px' : '140px' }} />
}

export function EventsContent() {
  const { data: events, loading, error } = useEvents()
  const [seasonFilter, setSeasonFilter] = useState<string>('All')
  const [gameFilter, setGameFilter] = useState<GameType | 'All'>('All')

  const seasons = useMemo(() => {
    if (!events) return ['All']
    const found = Array.from(new Set(events.map(e => e.season))).sort()
    return ['All', ...found]
  }, [events])

  // Derive game filter options from actual event data — no dead filters
  const gameFilters = useMemo(() => {
    const all = { label: 'ALL', value: 'All' as const }
    if (!events || events.length === 0) return [all]
    const types = Array.from(new Set(events.map(e => e.game_type))) as GameType[]
    // Preserve a stable display order
    const ORDER: GameType[] = ['FF', 'BGMI', 'Valorant', 'Anime', 'Other']
    const sorted = ORDER.filter(g => types.includes(g))
    return [all, ...sorted.map(g => ({ label: GAME_LABELS[g], value: g as GameType | 'All' }))]
  }, [events])

  // Base filter (season + game)
  const baseFiltered = useMemo(() => {
    if (!events) return []
    let list = events
    if (seasonFilter !== 'All') list = list.filter(e => e.season === seasonFilter)
    if (gameFilter !== 'All')   list = list.filter(e => e.game_type === gameFilter)
    return list
  }, [events, seasonFilter, gameFilter])

  // Tournaments — split upcoming / past
  const tournaments = useMemo(() => {
    const list = baseFiltered.filter(e => e.event_type === 'tournament' || !e.event_type)
    return splitEvents(list)
  }, [baseFiltered])

  // Workshops & Screenings — sorted by date desc (most recent first)
  const workshops = useMemo(() => {
    return baseFiltered
      .filter(e => e.event_type === 'workshop' || e.event_type === 'screening')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [baseFiltered])

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-section-heading mb-4" style={{ color: 'var(--text-muted)' }}>
          COULD NOT REACH THE ARENA
        </p>
        <p className="text-body mb-8" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Failed to load event data. Check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-label px-6 py-3"
          style={{
            border: '1px solid rgba(157,78,221,0.4)',
            borderRadius: '2px',
            color: 'var(--violet-bright)',
            background: 'none',
            cursor: 'pointer',
            letterSpacing: '0.12em',
          }}
        >
          RETRY
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div
        className="sticky z-20 px-6 md:px-10 py-4"
        style={{
          top: 'calc(var(--ticker-height) + var(--navbar-height))',
          background: 'rgba(10,8,18,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(157,78,221,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Season tabs */}
          <div className="flex gap-1">
            {seasons.map(s => (
              <button
                key={s}
                onClick={() => setSeasonFilter(s)}
                className="text-label px-4 py-2 rounded-sm transition-all duration-150"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  background: seasonFilter === s ? 'rgba(123,47,190,0.25)' : 'transparent',
                  color: seasonFilter === s ? 'var(--violet-bright)' : 'var(--text-muted)',
                  border: seasonFilter === s ? '1px solid rgba(157,78,221,0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div
            className="hidden sm:block"
            style={{ width: '1px', height: '20px', background: 'rgba(157,78,221,0.2)' }}
          />

          {/* Game filter pills — derived from actual event data */}
          <div className="flex flex-wrap gap-1">
            {gameFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setGameFilter(value)}
                className="text-label px-3 py-1.5 rounded-sm transition-all duration-150"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  background: gameFilter === value ? 'rgba(123,47,190,0.2)' : 'transparent',
                  color: gameFilter === value ? 'var(--violet-bright)' : 'var(--text-muted)',
                  border: gameFilter === value ? '1px solid rgba(157,78,221,0.35)' : '1px solid rgba(74,67,88,0.3)',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming Battles ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-16 pb-8 max-w-7xl mx-auto">
        <p className="text-label mb-4" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
          {DATA_CONFIG.club.currentSeason} · TOURNAMENTS
        </p>
        <h2 className="text-page-heading mb-12" style={{ color: 'var(--text-primary)' }}>
          Upcoming<br />
          <span className="text-violet-gradient">Battles</span>
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard tall />
            <SkeletonCard tall />
          </div>
        ) : tournaments.upcoming.length === 0 ? (
          <div
            className="p-12 rounded-lg text-center"
            style={{ border: '1px dashed rgba(157,78,221,0.2)', background: 'rgba(123,47,190,0.03)' }}
          >
            <p className="text-card-title mb-2" style={{ color: 'var(--text-muted)' }}>
              NO TOURNAMENTS SCHEDULED YET
            </p>
            <p className="text-body" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              The next battle is being planned. Check back soon.
            </p>
          </div>
        ) : (
          <StackScrollCards events={tournaments.upcoming} />
        )}
      </section>

      {/* ── Workshops & Screenings ───────────────────────────────────────────── */}
      {(loading || workshops.length > 0) && (
        <section
          className="px-6 md:px-10 py-16 max-w-7xl mx-auto"
          style={{ borderTop: '1px solid rgba(255,183,3,0.08)' }}
        >
          <p className="text-label mb-4" style={{ color: 'var(--gold-core)', letterSpacing: '0.2em' }}>
            {DATA_CONFIG.club.currentSeason} · ANIMATION WING
          </p>
          <h2 className="text-section-heading mb-10" style={{ color: 'var(--text-primary)' }}>
            Workshops &amp;{' '}
            <span className="text-gold-gradient">Screenings</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshops.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant={event.status === 'completed' ? 'past' : 'upcoming'}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Past Battles ────────────────────────────────────────────────────── */}
      {(loading || tournaments.past.length > 0) && (
        <section
          className="px-6 md:px-10 py-16 max-w-7xl mx-auto"
          style={{ borderTop: '1px solid rgba(157,78,221,0.08)' }}
        >
          <p className="text-label mb-4" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
            ARCHIVE
          </p>
          <h2 className="text-section-heading mb-10" style={{ color: 'var(--text-primary)' }}>
            Past Battles
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.past.map(event => (
                <EventCard key={event.id} event={event} variant="past" />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
