'use client'

import { motion } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'
import { EASE_OUT } from '@/lib/motion/easing'

interface SectionRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  /** y offset to start from. Default 32. */
  distance?: number
}

/**
 * Wraps any server-component content in a Framer Motion whileInView reveal.
 * Use this in server pages (page.tsx) to add scroll-triggered entrance
 * animations without converting the whole page to 'use client'.
 */
export function SectionReveal({
  children,
  delay = 0,
  className = '',
  style,
  distance = 24,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      // Expand the root 260px BELOW the viewport so a section starts revealing
      // before it scrolls into view and is already settled when it arrives.
      // The old '-80px' shrank the root, firing only once a section was 80px
      // inside the fold — which is why scrolling showed blank space first.
      viewport={{ once: true, margin: '0px 0px 260px 0px' }}
      transition={{ duration: 0.45, ease: EASE_OUT, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
