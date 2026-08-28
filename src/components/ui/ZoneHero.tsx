'use client'

import { motion } from 'framer-motion'
import { HudLabel } from './HudLabel'
import { ScrambleText } from '@/components/cinematic/ScrambleText'
import { EASE_EXPO, DUR, STAGGER } from '@/lib/motion/easing'
import { seasonTag } from '@/lib/utils'

interface ZoneHeroProps {
  /** Telemetry eyebrow — "THE BATTLEGROUND" */
  eyebrow: string
  /** Page title, split into stacked lines */
  lines: string[]
  /** Supporting copy under the title */
  copy?: string
  /** Eyebrow + accent color (defaults to zone accent) */
  accent?: string
  /** Outlined (stroke-only) treatment for these line indexes */
  outlineLines?: number[]
}

/**
 * Standard zone opener for subpages — eyebrow, oversized display title with
 * staggered rise, optional copy. Animates on mount (h1 is SSR-rendered).
 */
export function ZoneHero({ eyebrow, lines, copy, accent, outlineLines = [] }: ZoneHeroProps) {
  return (
    <header className="relative px-gutter pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE_EXPO }}
        >
          <HudLabel live color={accent ?? 'var(--zone-accent)'}>
            <ScrambleText text={eyebrow} delay={300} />
          </HudLabel>
        </motion.div>

        <h1 className="type-display-xl mt-5" style={{ color: 'var(--text-hi)' }}>
          {lines.map((line, i) => (
            <span key={line} className="line-reveal">
              <motion.span
                className="block"
                initial={{ y: '125%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: DUR.cinematic,
                  delay: 0.1 + i * STAGGER.loose,
                  ease: EASE_EXPO,
                }}
                style={
                  outlineLines.includes(i)
                    ? {
                        color: 'transparent',
                        WebkitTextStroke: `2px ${accent ?? 'var(--zone-accent)'}`,
                      }
                    : undefined
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {copy && (
          <motion.p
            className="type-body mt-7 max-w-md"
            style={{ color: 'var(--text-mid)' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, delay: 0.55, ease: EASE_EXPO }}
          >
            {copy}
          </motion.p>
        )}
      </div>

      {/* Edge telemetry */}
      <span
        aria-hidden="true"
        className="type-label absolute right-gutter top-16 hidden lg:block"
        style={{ color: 'var(--text-lo)', writingMode: 'vertical-rl' }}
      >
        DAG // SZN {seasonTag()}
      </span>
    </header>
  )
}
