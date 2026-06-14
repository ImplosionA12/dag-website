'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { EASE_OUT, EASE_EXPO } from '@/lib/motion/easing'

// Enter-only choreography — App Router unmounts the old page immediately,
// so exit animations are unreliable. Each zone gets a distinct entrance.
const ROUTE_ENTER: Record<string, Variants> = {
  '/': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
  },
  '/events': {
    initial: { opacity: 0, x: 48, clipPath: 'inset(0 100% 0 0)' },
    animate: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.45, ease: EASE_OUT } },
  },
  '/leaderboards': {
    initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5, ease: EASE_OUT } },
  },
  '/hall-of-fame': {
    initial: { opacity: 0, scale: 0.975 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_EXPO } },
  },
  '/members': {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  },
  '/polls': {
    initial: { opacity: 0, y: 28, clipPath: 'inset(100% 0 0 0)' },
    animate: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.5, ease: EASE_EXPO } },
  },
  '/about': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.65, ease: EASE_OUT } },
  },
}

function getEnter(pathname: string) {
  for (const route of Object.keys(ROUTE_ENTER)) {
    if (route !== '/' && pathname.startsWith(route)) return ROUTE_ENTER[route]
  }
  return ROUTE_ENTER['/']
}

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const enter = getEnter(pathname)

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        key={pathname}
        variants={enter}
        initial="initial"
        animate="animate"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>

      {/* Shutter — a void panel that wipes open on every route mount */}
      <motion.div
        key={`shutter-${pathname}`}
        className="z-transition"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: EASE_EXPO }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--void)',
          transformOrigin: 'top',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
