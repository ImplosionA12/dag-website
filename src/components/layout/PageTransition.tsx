'use client'

import { ReactNode } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Per-route transition personalities
const ROUTE_VARIANTS: Record<string, Variants> = {
  // Home — soft dark fade, returning to base
  '/': {
    initial:  { opacity: 0 },
    animate:  { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit:     { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  },

  // Events — fast horizontal slash, like a match starting
  '/events': {
    initial:  { opacity: 0, x: '60px', clipPath: 'inset(0 100% 0 0)' },
    animate:  { opacity: 1, x: '0px', clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:     { opacity: 0, x: '-40px', transition: { duration: 0.5, ease: 'easeIn' } },
  },

  // Leaderboards — vertical scan line top to bottom
  '/leaderboards': {
    initial:  { opacity: 0, y: '-20px', clipPath: 'inset(0 0 100% 0)' },
    animate:  { opacity: 1, y: '0px',  clipPath: 'inset(0 0 0% 0)',   transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:     { opacity: 0, y: '20px',  transition: { duration: 0.5, ease: 'easeIn' } },
  },

  // Hall of Fame — gold flood from center outward
  '/hall-of-fame': {
    initial:  { opacity: 0, scale: 0.97 },
    animate:  { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit:     { opacity: 0, scale: 1.02, transition: { duration: 0.5, ease: 'easeIn' } },
  },

  // Members — gentle fade with slight scale, warm and human
  '/members': {
    initial:  { opacity: 0, scale: 0.98 },
    animate:  { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit:     { opacity: 0, scale: 0.99, transition: { duration: 0.4, ease: 'easeIn' } },
  },

  // About — slow dissolve, like opening a book
  '/about': {
    initial:  { opacity: 0 },
    animate:  { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit:     { opacity: 0, transition: { duration: 0.6, ease: 'easeIn' } },
  },
}

const DEFAULT_VARIANTS: Variants = ROUTE_VARIANTS['/']

function getVariants(pathname: string): Variants {
  // Match exact, then prefix
  for (const route of Object.keys(ROUTE_VARIANTS)) {
    if (route !== '/' && pathname.startsWith(route)) return ROUTE_VARIANTS[route]
  }
  if (pathname === '/') return ROUTE_VARIANTS['/']
  return DEFAULT_VARIANTS
}

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const variants = getVariants(pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
