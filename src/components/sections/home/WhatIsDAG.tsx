'use client'

import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export function WhatIsDAG() {
  return (
    <section
      className="px-6 md:px-10 py-section"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,47,190,0.06) 0%, transparent 70%),
          var(--bg-primary)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric background text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 700,
          fontSize: 'clamp(6rem, 18vw, 16rem)',
          color: 'rgba(123,47,190,0.025)',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.05em',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        DAG
      </div>

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Section label + heading — fade up */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p
            className="text-label text-center mb-6"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
          >
            WHAT IS DAG
          </p>
          <h2
            className="text-section-heading text-center mb-16"
            style={{ color: 'var(--text-primary)' }}
          >
            Two Wings,{' '}
            <span className="text-violet-gradient">One Identity</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '0' }}
        >
          {/* Gaming Wing — slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: EASE }}
            className="p-8 md:p-12"
            style={{ borderRight: '1px solid transparent' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '2px',
                  background: 'var(--violet-core)',
                }}
              />
              <p
                className="text-label"
                style={{ color: 'var(--violet-bright)', letterSpacing: '0.2em' }}
              >
                GAMING WING
              </p>
            </div>
            <h3
              className="text-card-title mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              We Compete
            </h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              DAG runs structured tournaments, builds competitive players, and tracks performance
              across every season. Free Fire squads, BGMI tacticians, Valorant duelists —
              we field players across every battleground. From intraclub events to full season
              championships, every match is a stage.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {(['FF', 'BGMI', 'Valorant'] as const).map(g => (
                <span
                  key={g}
                  className="text-label px-3 py-1 rounded-sm"
                  style={{
                    background: 'rgba(123,47,190,0.1)',
                    border: '1px solid rgba(157,78,221,0.2)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.65rem',
                  }}
                >
                  {g === 'FF' ? 'FREE FIRE' : g}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Gold divider */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20%',
              height: '60%',
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, var(--gold-core), transparent)',
              opacity: 0.3,
            }}
          />

          {/* Animation Wing — slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
            className="p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '2px',
                  background: 'var(--gold-core)',
                }}
              />
              <p
                className="text-label"
                style={{ color: 'var(--gold-core)', letterSpacing: '0.2em' }}
              >
                ANIMATION WING
              </p>
            </div>
            <h3
              className="text-card-title mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              We Create &amp; Celebrate
            </h3>
            <p className="text-body mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              The Animation wing runs two parallel tracks. One builds — 3D renders, motion
              graphics, VFX, season highlight reels, and Blender workshops that turn
              beginners into artists. The other gathers — anime screenings, episode discussions,
              and a culture of appreciation for the craft behind every frame.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-wrap gap-2">
                {['BLENDER', 'AFTER EFFECTS', 'VFX', '3D RENDER', 'WORKSHOPS'].map(tag => (
                  <span
                    key={tag}
                    className="text-label px-3 py-1 rounded-sm"
                    style={{
                      background: 'rgba(255,183,3,0.08)',
                      border: '1px solid rgba(255,183,3,0.2)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.65rem',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['ANIME SCREENINGS', 'DISCUSSIONS', 'APPRECIATION'].map(tag => (
                  <span
                    key={tag}
                    className="text-label px-3 py-1 rounded-sm"
                    style={{
                      background: 'rgba(224,64,251,0.07)',
                      border: '1px solid rgba(224,64,251,0.2)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.65rem',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
