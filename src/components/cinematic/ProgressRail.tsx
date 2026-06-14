'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Broadcast scroll telemetry — a thin progress rail pinned to the right
 * edge with a live percentage feel. Desktop only, purely decorative.
 */
export function ProgressRail() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <div
      aria-hidden="true"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-nav hidden lg:flex flex-col items-center gap-3 pointer-events-none"
    >
      <span
        className="type-label"
        style={{ color: 'var(--text-lo)', writingMode: 'vertical-rl', fontSize: '0.55rem' }}
      >
        FEED
      </span>
      <div className="relative h-36 w-px" style={{ background: 'var(--line-1)' }}>
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            height: '100%',
            background: 'var(--zone-accent)',
            scaleY,
            transformOrigin: 'top',
          }}
        />
      </div>
      <span
        className="type-label"
        style={{ color: 'var(--text-lo)', writingMode: 'vertical-rl', fontSize: '0.55rem' }}
      >
        END
      </span>
    </div>
  )
}
