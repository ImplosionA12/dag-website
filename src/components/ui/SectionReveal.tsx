'use client'

import { motion } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'

interface SectionRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  /** y offset to start from. Default 36. */
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
  distance = 36,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
