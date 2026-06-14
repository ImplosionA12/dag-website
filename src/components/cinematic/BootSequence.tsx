'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_EXPO } from '@/lib/motion/easing'

const STORAGE_KEY = 'dag-boot-seen'
const LINE_INTERVAL_MS = 230
const HOLD_AFTER_MS = 650

const BOOT_LINES = [
  'DAG://BOOT_SEQUENCE V1.0',
  'LOADING ARENA ASSETS .......... OK',
  'CALIBRATING HUD ............... OK',
  'SYNCING SEASON FEED ........... OK',
  'SIGNAL LOCKED // WELCOME TO THE ARENA',
]

type Phase = 'idle' | 'running' | 'done'

/**
 * One-time game-OS boot intro — telemetry lines tick in over the void,
 * then the overlay lifts and the title screen plays underneath.
 * Session-gated, skippable (click / any key), skipped entirely under
 * reduced motion. Decorative: the page renders beneath it regardless.
 */
export function BootSequence() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [lineCount, setLineCount] = useState(0)

  // Decide once, post-hydration — sessionStorage + matchMedia read directly
  // so the gate doesn't flicker like the lagging useReducedMotion state would.
  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduced) {
      setPhase('done')
    } else {
      setPhase('running')
    }
  }, [])

  useEffect(() => {
    if (phase !== 'running') return

    const finish = () => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setPhase('done')
    }

    const interval = setInterval(() => {
      setLineCount(count => Math.min(count + 1, BOOT_LINES.length))
    }, LINE_INTERVAL_MS)

    const total = setTimeout(finish, BOOT_LINES.length * LINE_INTERVAL_MS + HOLD_AFTER_MS)

    const onSkip = () => finish()
    window.addEventListener('pointerdown', onSkip)
    window.addEventListener('keydown', onSkip)

    return () => {
      clearInterval(interval)
      clearTimeout(total)
      window.removeEventListener('pointerdown', onSkip)
      window.removeEventListener('keydown', onSkip)
    }
  }, [phase])

  const progress = Math.min(lineCount / BOOT_LINES.length, 1)

  return (
    <AnimatePresence>
      {phase === 'running' && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col justify-between px-gutter py-10"
          style={{ background: 'var(--void)' }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_EXPO } }}
          aria-hidden="true"
        >
          <div className="scanlines opacity-50" />

          {/* Corner brackets */}
          <span className="absolute top-6 left-6 w-4 h-4" style={{ borderTop: '1px solid var(--bracket)', borderLeft: '1px solid var(--bracket)' }} />
          <span className="absolute top-6 right-6 w-4 h-4" style={{ borderTop: '1px solid var(--bracket)', borderRight: '1px solid var(--bracket)' }} />
          <span className="absolute bottom-6 left-6 w-4 h-4" style={{ borderBottom: '1px solid var(--bracket)', borderLeft: '1px solid var(--bracket)' }} />
          <span className="absolute bottom-6 right-6 w-4 h-4" style={{ borderBottom: '1px solid var(--bracket)', borderRight: '1px solid var(--bracket)' }} />

          {/* Boot log */}
          <div className="relative mt-12">
            {BOOT_LINES.slice(0, lineCount).map((line, i) => {
              const isLast = i === BOOT_LINES.length - 1
              return (
                <motion.p
                  key={line}
                  className="type-hud mb-2"
                  style={{
                    color: isLast ? 'var(--zone-accent)' : 'var(--text-mid)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                >
                  {`> ${line}`}
                </motion.p>
              )
            })}
          </div>

          {/* Progress + skip hint */}
          <div className="relative">
            <div className="flex items-baseline justify-between mb-3">
              <span
                className="type-hud"
                style={{ color: 'var(--text-hi)', fontVariantNumeric: 'tabular-nums' }}
              >
                {String(Math.round(progress * 100)).padStart(3, '0')}%
              </span>
              <span className="type-label animate-flicker" style={{ color: 'var(--text-lo)' }}>
                PRESS ANY KEY TO SKIP
              </span>
            </div>
            <div className="h-[2px] w-full overflow-hidden" style={{ background: 'var(--line-1)' }}>
              <motion.div
                className="h-full"
                style={{ background: 'var(--zone-accent)' }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.2, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
