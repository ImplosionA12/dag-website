'use client'

import { motion } from 'framer-motion'
import { EASE_EXPO, DUR } from '@/lib/motion/easing'
import { clsx } from '@/lib/utils'

interface AnimatedBarProps {
  label: string
  /** 0–100, clamped */
  percentage: number
  /** Bar fill color — defaults to a neutral; leaders pass the zone accent */
  color?: string
  /** Right-side readout override (defaults to "NN%") */
  readout?: string
  delay?: number
  className?: string
}

/**
 * Broadcast percentage bar — label, animated fill, tabular % readout.
 */
export function AnimatedBar({
  label,
  percentage,
  color = 'var(--text-mid)',
  readout,
  delay = 0,
  className = '',
}: AnimatedBarProps) {
  const pct = Math.max(0, Math.min(100, percentage))

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="type-body" style={{ color: 'var(--text-hi)', fontSize: '0.9rem' }}>
          {label}
        </span>
        <span
          className="type-hud"
          style={{ color, fontWeight: 600 }}
        >
          {readout ?? `${pct}%`}
        </span>
      </div>
      <div
        className="relative h-[3px] w-full overflow-hidden"
        style={{ background: 'var(--line-1)' }}
        role="presentation"
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: color }}
          initial={{ width: '0%' }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: DUR.slow, delay, ease: EASE_EXPO }}
        />
      </div>
    </div>
  )
}
