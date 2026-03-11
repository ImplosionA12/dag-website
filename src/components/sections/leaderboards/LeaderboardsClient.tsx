'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboards } from '@/hooks/useLeaderboards'
import { getRankColor } from '@/lib/utils'
import { GameBadge } from '@/components/ui/GameBadge'
import { LeaderboardEntry } from '@/types'

const RANK_ICONS: Record<number, string> = { 1: '👑', 2: '🥈', 3: '🥉' }
const INITIAL_VISIBLE = 8

function RankRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const isTop3 = entry.rank <= 3
  const rankColor = getRankColor(entry.rank)

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.055, duration: 0.35, ease: 'easeOut' }}
    >
      <motion.div
        animate={entry.rank === 1 ? { scale: [1, 1.02, 1] } : {}}
        transition={entry.rank === 1 ? { delay: 0.5, duration: 0.4 } : {}}
        className="flex items-center gap-4 rounded-sm px-4 py-4 md:px-6 transition-all duration-200"
        style={{
          background: isTop3
            ? `rgba(${entry.rank === 1 ? '255,183,3' : entry.rank === 2 ? '192,192,192' : '205,127,50'},0.07)`
            : index % 2 === 0 ? 'rgba(123,47,190,0.04)' : 'transparent',
          border: `1px solid ${isTop3 ? `${rankColor}30` : 'rgba(157,78,221,0.07)'}`,
          boxShadow: entry.rank === 1 ? `0 0 20px rgba(255,183,3,0.12)` : 'none',
          marginBottom: '4px',
        }}
      >
        {/* Rank */}
        <div
          style={{
            minWidth: '48px',
            fontFamily: 'var(--font-orbitron)',
            fontWeight: 700,
            fontSize: entry.rank <= 9 ? '1.4rem' : '1rem',
            color: rankColor,
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          {RANK_ICONS[entry.rank] || `#${entry.rank}`}
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              textTransform: 'uppercase',
              color: isTop3 ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            }}
          >
            {entry.player_name}
          </p>
          {entry.team_name && (
            <p
              className="text-label mt-0.5"
              style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}
            >
              {entry.team_name}
            </p>
          )}
        </div>

        {/* Game badge */}
        <GameBadge game={entry.game_type} size="sm" className="hidden sm:inline-flex" />

        {/* Points */}
        <div
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: entry.rank === 1 ? 'var(--gold-core)' : 'var(--text-secondary)',
            letterSpacing: '0.05em',
            minWidth: '60px',
            textAlign: 'right',
          }}
        >
          {entry.points}
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              marginLeft: '4px',
            }}
          >
            PTS
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function LeaderboardsClient() {
  const searchParams = useSearchParams()
  const { data: allEntries, loading, error } = useLeaderboards()
  const [expanded, setExpanded] = useState(false)

  // Derive unique event names from data
  const eventNames = useMemo(() => {
    if (!allEntries) return []
    return Array.from(new Set(allEntries.map(e => e.event_name)))
  }, [allEntries])

  // Default selection: from URL param or first event
  const paramEvent = searchParams.get('event')
  const defaultEvent = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return ''
    if (paramEvent) {
      // Try to match by event_name containing the param
      const match = allEntries.find(e =>
        e.event_name.toLowerCase().includes(paramEvent.toLowerCase())
      )
      if (match) return match.event_name
    }
    return eventNames[0] || ''
  }, [allEntries, eventNames, paramEvent])

  const [selectedEvent, setSelectedEvent] = useState<string>('')

  // Auto-select first event once data loads (only if user hasn't picked one yet)
  useEffect(() => {
    if (defaultEvent && !selectedEvent) {
      setSelectedEvent(defaultEvent)
    }
  }, [defaultEvent, selectedEvent])

  const activeEvent = selectedEvent || defaultEvent

  // Filter + sort entries for selected event
  const entries = useMemo(() => {
    if (!allEntries || !activeEvent) return []
    return allEntries
      .filter(e => e.event_name === activeEvent)
      .sort((a, b) => a.rank - b.rank)
  }, [allEntries, activeEvent])

  const visibleEntries = expanded ? entries : entries.slice(0, INITIAL_VISIBLE)
  const hasMore = entries.length > INITIAL_VISIBLE

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-section-heading mb-4" style={{ color: 'var(--text-muted)' }}>
          COULD NOT REACH THE ARENA
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-label px-6 py-3"
          style={{
            border: '1px solid rgba(157,78,221,0.4)', borderRadius: '2px',
            color: 'var(--violet-bright)', background: 'none', cursor: 'pointer', letterSpacing: '0.12em',
          }}
        >
          RETRY
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
      {/* ── Event selector ─────────────────────────────────────────────── */}
      <div className="mb-10">
        {loading ? (
          <div className="skeleton rounded" style={{ height: '48px', maxWidth: '400px' }} />
        ) : eventNames.length === 0 ? null : (
          <div className="flex flex-col gap-2">
            <p className="text-label" style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
              SELECT EVENT
            </p>
            <div className="flex flex-wrap gap-2">
              {eventNames.map(name => (
                <button
                  key={name}
                  onClick={() => { setSelectedEvent(name); setExpanded(false) }}
                  className="text-label px-4 py-2 rounded-sm transition-all duration-150"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    background: activeEvent === name ? 'rgba(123,47,190,0.2)' : 'transparent',
                    color: activeEvent === name ? 'var(--violet-bright)' : 'var(--text-secondary)',
                    border: activeEvent === name
                      ? '1px solid rgba(157,78,221,0.4)'
                      : '1px solid rgba(74,67,88,0.3)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    maxWidth: '280px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Table header ───────────────────────────────────────────────── */}
      {!loading && entries.length > 0 && (
        <div
          className="flex items-center gap-4 px-4 md:px-6 pb-3 mb-2"
          style={{ borderBottom: '1px solid rgba(157,78,221,0.12)' }}
        >
          <div style={{ minWidth: '48px' }} />
          <div className="flex-1">
            <span className="text-label" style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
              PLAYER
            </span>
          </div>
          <span className="text-label hidden sm:block" style={{ color: 'var(--text-muted)' }}>
            GAME
          </span>
          <span
            className="text-label"
            style={{ color: 'var(--text-muted)', minWidth: '60px', textAlign: 'right' }}
          >
            POINTS
          </span>
        </div>
      )}

      {/* ── Rows ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton rounded-sm" style={{ height: '60px' }} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div
          className="py-20 text-center rounded-lg"
          style={{ border: '1px dashed rgba(157,78,221,0.2)', background: 'rgba(123,47,190,0.03)' }}
        >
          <p className="text-card-title mb-2" style={{ color: 'var(--text-muted)' }}>
            NO RESULTS RECORDED YET
          </p>
          <p className="text-body" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {activeEvent
              ? `Leaderboard for "${activeEvent}" has not been published.`
              : 'Select an event to see its leaderboard.'}
          </p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div key={activeEvent}>
              {visibleEntries.map((entry, i) => (
                <RankRow key={entry.id} entry={entry} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full mt-4 py-3 text-label transition-all duration-200"
              style={{
                border: '1px solid rgba(157,78,221,0.2)',
                borderRadius: '2px',
                color: 'var(--text-secondary)',
                background: 'none',
                cursor: 'pointer',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.7rem',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(157,78,221,0.4)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--violet-bright)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(157,78,221,0.2)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
              }}
            >
              {expanded
                ? `▲ SHOW LESS`
                : `▼ VIEW FULL LEADERBOARD — ${entries.length - INITIAL_VISIBLE} MORE`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
