'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useHallOfFame } from '@/hooks/useHallOfFame'
import { HOF_CATEGORIES } from '@/types'
import { GameBadge } from '@/components/ui/GameBadge'
import { DATA_CONFIG } from '@/config/data'

function SkeletonCard() {
  return <div className="skeleton rounded-lg" style={{ height: '220px' }} />
}

export function HallOfFameContent() {
  const { data: entries, loading, error } = useHallOfFame()
  const [selectedSeason, setSelectedSeason] = useState(DATA_CONFIG.club.currentSeason)

  const seasons = DATA_CONFIG.club.seasons

  // Map entries for the selected season by category
  const entryMap = useMemo(() => {
    if (!entries) return {}
    return Object.fromEntries(
      entries
        .filter(e => e.season === selectedSeason && e.player_name)
        .map(e => [e.category, e])
    )
  }, [entries, selectedSeason])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <p className="text-section-heading mb-4" style={{ color: 'var(--text-muted)' }}>
          THE SHRINE IS OFFLINE
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-label px-6 py-3"
          style={{
            border: '1px solid rgba(255,183,3,0.4)',
            borderRadius: '2px',
            color: 'var(--gold-core)',
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
    <div className="px-6 md:px-10 pb-section max-w-7xl mx-auto">
      {/* Season selector */}
      {seasons.length > 1 && (
        <div className="flex gap-2 mb-14">
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className="text-label px-5 py-2.5 rounded-sm transition-all duration-150"
              style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                background: selectedSeason === s ? 'rgba(255,183,3,0.15)' : 'transparent',
                color: selectedSeason === s ? 'var(--gold-core)' : 'var(--text-muted)',
                border: selectedSeason === s
                  ? '1px solid rgba(255,183,3,0.4)'
                  : '1px solid rgba(74,67,88,0.3)',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* 3×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : HOF_CATEGORIES.map(({ category, icon, description }, i) => {
              const entry = entryMap[category]
              const isFilled = !!entry

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                >
                  <div
                    className="relative rounded-lg p-6 h-full flex flex-col"
                    style={{
                      background: isFilled
                        ? 'linear-gradient(135deg, rgba(255,183,3,0.06) 0%, rgba(123,47,190,0.08) 100%)'
                        : 'rgba(123,47,190,0.03)',
                      border: isFilled
                        ? '1px solid rgba(255,183,3,0.25)'
                        : '1px dashed rgba(157,78,221,0.15)',
                      boxShadow: isFilled ? '0 0 28px rgba(255,183,3,0.07)' : 'none',
                      minHeight: '200px',
                    }}
                  >
                    {/* Gold bloom — filled only */}
                    {isFilled && (
                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.08 + 0.25, duration: 0.6 }}
                        style={{
                          background:
                            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,183,3,0.09) 0%, transparent 70%)',
                        }}
                        aria-hidden
                      />
                    )}

                    {/* Icon + category name */}
                    <div className="flex items-center gap-2 mb-3">
                      <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{icon}</span>
                      <p
                        className="text-label"
                        style={{
                          fontFamily: 'var(--font-orbitron)',
                          fontSize: '0.58rem',
                          letterSpacing: '0.18em',
                          color: isFilled ? 'var(--gold-core)' : 'var(--text-muted)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {category}
                      </p>
                    </div>

                    {isFilled ? (
                      <>
                        {/* Player name */}
                        <p
                          style={{
                            fontFamily: 'var(--font-rajdhani)',
                            fontWeight: 700,
                            fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                            textTransform: 'uppercase',
                            color: 'var(--text-primary)',
                            letterSpacing: '0.04em',
                            lineHeight: 1.1,
                            marginBottom: '0.5rem',
                          }}
                        >
                          {entry.player_name}
                        </p>

                        {/* Game badge */}
                        {entry.game_type !== 'Other' && (
                          <GameBadge game={entry.game_type} size="sm" className="mb-3 self-start" />
                        )}

                        {/* Description */}
                        <p
                          className="text-body mt-auto"
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                            fontStyle: 'italic',
                          }}
                        >
                          &ldquo;{entry.description}&rdquo;
                        </p>
                      </>
                    ) : (
                      <>
                        {/* Category description */}
                        <p
                          className="text-body mb-4"
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.78rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {description}
                        </p>

                        {/* Vacant badge */}
                        <span
                          className="mt-auto self-start text-label px-3 py-1.5"
                          style={{
                            fontFamily: 'var(--font-orbitron)',
                            fontSize: '0.52rem',
                            letterSpacing: '0.18em',
                            color: 'var(--text-muted)',
                            border: '1px dashed rgba(157,78,221,0.2)',
                            borderRadius: '2px',
                          }}
                        >
                          NOT YET AWARDED
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
      </div>
    </div>
  )
}
