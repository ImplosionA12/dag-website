'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { EASE_OUT, EASE_EXPO } from '@/lib/motion/easing'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Route transition — enter-only. App Router unmounts the old page immediately,
 * so exit animations never get to run.
 *
 * Everything here animates `transform` and `opacity` and nothing else. The
 * previous version animated `clipPath` and `scale` on a wrapper holding the
 * entire page; the compositor can't take either, so every frame repainted and
 * re-rasterized the whole document — that was the jank.
 *
 * The shutter slides on translateY rather than scaleY so its leading edge line
 * travels at a constant thickness instead of being squashed by the scale.
 */

/** Zones whose wipe is not the default violet. Gold is HoF's, per gold discipline. */
const ZONE_ACCENT: Record<string, string> = {
  '/hall-of-fame': 'var(--gold-400)',
}

function accentFor(pathname: string): string {
  for (const route of Object.keys(ZONE_ACCENT)) {
    if (pathname.startsWith(route)) return ZONE_ACCENT[route]
  }
  return 'var(--violet-300)'
}

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const accent = accentFor(pathname)

  if (reducedMotion) {
    return <div style={{ position: 'relative', minHeight: '100vh' }}>{children}</div>
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE_OUT, delay: 0.06 }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>

      {/* Shutter — a panel that sweeps up off-screen, trailing a lit edge.
          Distinct from the page: void-on-void made the old one invisible. */}
      <motion.div
        key={`shutter-${pathname}`}
        className="z-transition"
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.62, ease: EASE_EXPO }}
        style={{
          position: 'fixed',
          inset: 0,
          background: `linear-gradient(180deg, var(--void) 0%, var(--surface-2) 62%, var(--surface-3) 100%)`,
          borderBottom: `2px solid ${accent}`,
          boxShadow: `0 12px 60px -8px ${accent}`,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
