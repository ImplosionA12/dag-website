'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ScrambleText } from '@/components/cinematic/ScrambleText'
import { CTAButton } from '@/components/ui/CTAButton'
import { GhostButton } from '@/components/ui/GhostButton'
import { HudLabel } from '@/components/ui/HudLabel'
import { EASE_EXPO, DUR } from '@/lib/motion/easing'
import { DATA_CONFIG } from '@/config/data'

const TitleField = dynamic(() => import('@/components/three/TitleField'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(123,47,190,0.14) 0%, transparent 60%)',
      }}
    />
  ),
})

const HEADLINE = ['ENTER', 'THE ARENA']

export function HomeHero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Content scrubs away as the user scrolls past the hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ minHeight: '100svh', paddingTop: 'var(--page-top)' }}
    >
      {/* Backdrop — shader field on desktop, layered gradient elsewhere */}
      {reducedMotion ? (
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 40%, rgba(123,47,190,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 70% 70%, rgba(74,26,122,0.25) 0%, transparent 70%)
            `,
          }}
        />
      ) : (
        <TitleField />
      )}

      {/* Scrims — left panel holds the type, vignette holds the edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(90deg, rgba(5,4,8,0.78) 0%, rgba(5,4,8,0.45) 38%, transparent 68%),
            radial-gradient(ellipse 110% 95% at 50% 50%, transparent 35%, rgba(5,4,8,0.9) 100%)
          `,
        }}
      />
      <div className="scanlines opacity-30" aria-hidden="true" />

      {/* HUD corner telemetry — frames the whole viewport */}
      <div
        className="absolute pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{ inset: 'calc(var(--page-top) + 12px) 24px 24px' }}
      >
        <span className="absolute top-0 left-0 type-label" style={{ color: 'var(--text-lo)' }}>
          SZN 01 // ACTIVE
        </span>
        <span className="absolute top-0 right-0 type-label" style={{ color: 'var(--text-lo)' }}>
          SIGNAL // STABLE
        </span>
        <span className="absolute bottom-0 left-0 type-label" style={{ color: 'var(--text-lo)' }}>
          {DATA_CONFIG.club.fullName.toUpperCase()}
        </span>
        <span className="absolute bottom-0 right-0 type-label" style={{ color: 'var(--text-lo)' }}>
          EST. 2025 // BROADCAST 01
        </span>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-gutter w-full max-w-7xl mx-auto"
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="mb-6">
          <HudLabel live>
            <ScrambleText text="DRUSHYA ANIMATIONS & GAMING" delay={400} />
          </HudLabel>
        </div>

        <h1 className="type-display-xl" style={{ color: 'var(--text-hi)' }}>
          {HEADLINE.map((line, i) => (
            <span key={line} className="line-reveal">
              <motion.span
                className="block"
                initial={{ y: '125%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.cinematic, delay: 0.15 + i * 0.14, ease: EASE_EXPO }}
              >
                {i === 1 ? (
                  <>
                    THE{' '}
                    <span
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '2px var(--violet-300)',
                        filter: 'drop-shadow(0 0 22px rgba(157,78,221,0.45))',
                      }}
                    >
                      ARENA
                    </span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="type-body mt-8 max-w-md"
          style={{ color: 'var(--text-mid)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 0.9, ease: EASE_EXPO }}
        >
          {DATA_CONFIG.club.tagline}. Tournaments, standings, and a Hall of Fame —
          one club, two wings, zero chill.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 1.05, ease: EASE_EXPO }}
        >
          <CTAButton href={DATA_CONFIG.forms.joinUs || '#'} size="lg" pulse>
            JOIN THE CLUB
          </CTAButton>
          <GhostButton href="/events" size="lg">
            BROWSE EVENTS
          </GhostButton>
        </motion.div>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={reducedMotion ? undefined : { opacity: contentOpacity }}
        aria-hidden="true"
      >
        <span className="type-label" style={{ color: 'var(--text-lo)' }}>
          PRESS START — SCROLL
        </span>
        <motion.span
          style={{ width: 1, height: 36, background: 'var(--zone-accent)', display: 'block' }}
          animate={reducedMotion ? undefined : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
