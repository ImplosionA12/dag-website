'use client'

import { motion } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'
import { EASE_OUT, DUR } from '@/lib/motion/easing'

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
  distance = 32,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: DUR.base, ease: EASE_OUT, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
