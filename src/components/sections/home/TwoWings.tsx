'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PinnedScene } from '@/components/cinematic/PinnedScene'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EASE_EXPO, DUR } from '@/lib/motion/easing'

const WINGS = [
  {
    id: 'gaming',
    index: '01',
    title: 'GAMING',
    accent: 'var(--violet-300)',
    copy: 'Ranked grinds, scrims, and full-bracket tournaments across Free Fire, BGMI, and Valorant. Climb the standings. Claim the crown.',
    tags: ['TOURNAMENTS', 'LEADERBOARDS', 'SCRIMS'],
  },
  {
    id: 'animation',
    index: '02',
    title: 'ANIMATION',
    accent: 'var(--game-anime)',
    copy: 'Screenings, frame-by-frame breakdowns, and original work from the creative wing. Worlds built one frame at a time.',
    tags: ['SCREENINGS', 'WORKSHOPS', 'ORIGINALS'],
  },
] as const

function WingPanel({ wing }: { wing: (typeof WINGS)[number] }) {
  return (
    <div className={`wing-${wing.id} relative flex flex-col justify-center px-8 md:px-14 py-14`}>
      <span
        className="type-label mb-4"
        style={{ color: wing.accent }}
        aria-hidden="true"
      >
        WING {wing.index} {'//'}
      </span>
      <h3
        className="type-display mb-6"
        style={{
          color: 'transparent',
          WebkitTextStroke: `1.5px ${wing.accent}`,
        }}
      >
        {wing.title}
      </h3>
      <p className="type-body max-w-sm mb-8" style={{ color: 'var(--text-mid)' }}>
        {wing.copy}
      </p>
      <div className="flex flex-wrap gap-2">
        {wing.tags.map(tag => (
          <span
            key={tag}
            className="type-label px-3 py-1.5"
            style={{ color: 'var(--text-mid)', border: '1px solid var(--line-1)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * The two wings of DAG — GAMING | ANIMATION. Pinned scrub scene on desktop
 * (wings converge from off-screen into a diagonal split); stacked reveals
 * on mobile / reduced motion.
 */
export function TwoWings() {
  const reducedMotion = useReducedMotion()

  const header = (
    <div className="px-gutter pt-section pb-12 max-w-7xl mx-auto w-full">
      <HudLabel>ONE CLUB // TWO WINGS</HudLabel>
      <h2 className="type-h2 mt-4" style={{ color: 'var(--text-hi)' }}>
        WHAT IS DAG
      </h2>
    </div>
  )

  if (reducedMotion) {
    return (
      <section>
        {header}
        <div className="px-gutter pb-section max-w-7xl mx-auto grid gap-6">
          {WINGS.map(wing => (
            <SectionReveal key={wing.id}>
              <div style={{ border: '1px solid var(--line-1)', background: 'var(--surface-1)' }}>
                <WingPanel wing={wing} />
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      {header}
      <PinnedScene
        lengthVh={0.85}
        className="relative"
        build={(gsap, el, tl) => {
          tl.fromTo(
            el.querySelector('.wing-gaming'),
            { xPercent: -55, opacity: 0.25 },
            { xPercent: 0, opacity: 1, ease: 'power2.out' },
            0
          )
          tl.fromTo(
            el.querySelector('.wing-animation'),
            { xPercent: 55, opacity: 0.25 },
            { xPercent: 0, opacity: 1, ease: 'power2.out' },
            0
          )
          tl.fromTo(
            el.querySelector('.wing-divider'),
            { scaleY: 0 },
            { scaleY: 1, ease: 'power2.inOut' },
            0.18
          )
          tl.fromTo(
            el.querySelector('.wing-x'),
            { scale: 0, rotate: -90, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.8)' },
            0.3
          )
        }}
      >
        <div
          className="relative grid md:grid-cols-2 items-stretch overflow-hidden"
          style={{ minHeight: '100vh' }}
        >
          <WingPanel wing={WINGS[0]} />
          <WingPanel wing={WINGS[1]} />

          {/* Diagonal divider */}
          <div
            className="wing-divider absolute left-1/2 top-0 bottom-0 hidden md:block"
            aria-hidden="true"
            style={{
              width: 1,
              background:
                'linear-gradient(180deg, transparent, var(--line-2) 20%, var(--line-2) 80%, transparent)',
              transform: 'skewX(-8deg)',
              transformOrigin: 'center',
            }}
          />

          {/* Center mark */}
          <motion.div
            className="wing-x absolute left-1/2 top-1/2 hidden md:flex items-center justify-center"
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              marginLeft: -28,
              marginTop: -28,
              border: '1px solid var(--line-2)',
              background: 'var(--void)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: 'var(--zone-accent)',
              transform: 'rotate(45deg)',
            }}
            initial={false}
            transition={{ duration: DUR.base, ease: EASE_EXPO }}
          >
            <span style={{ transform: 'rotate(-45deg)' }}>×</span>
          </motion.div>
        </div>
      </PinnedScene>
    </section>
  )
}
