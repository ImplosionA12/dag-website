'use client'

import { motion } from 'framer-motion'
import { EASE_EXPO, DUR, STAGGER } from '@/lib/motion/easing'
import { clsx } from '@/lib/utils'

interface DisplayHeadingProps {
  /** Single line, or multiple lines stacked */
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  /** Type scale class — defaults to .type-display */
  scale?: 'display-xl' | 'display' | 'h2'
  className?: string
  /** Per-line color overrides (falls back to text-hi) */
  colors?: (string | undefined)[]
  /** Bleed off-canvas horizontally */
  bleed?: boolean
  delay?: number
}

/**
 * Big Shoulders display heading with a per-line rise reveal.
 * SSR renders the full text in the DOM (SEO-safe) — Framer animates from
 * the hidden initial state only on the client.
 */
export function DisplayHeading({
  lines,
  as: Tag = 'h2',
  scale = 'display',
  className = '',
  colors = [],
  bleed = false,
  delay = 0,
}: DisplayHeadingProps) {
  return (
    <Tag className={clsx(`type-${scale}`, bleed && 'bleed-x', className)}>
      {lines.map((line, i) => (
        <span key={i} className="line-reveal">
          <motion.span
            className="block"
            style={{ color: colors[i] ?? 'var(--text-hi)' }}
            initial={{ y: '125%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: DUR.slow,
              delay: delay + i * STAGGER.loose,
              ease: EASE_EXPO,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
