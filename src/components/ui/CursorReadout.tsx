'use client'

import { useEffect, useRef } from 'react'
import { clsx } from '@/lib/utils'

/** Value rendered on the server, on first paint, and wherever tracking is inert. */
const REST = '0.000, 0.000'

interface CursorReadoutProps {
  /** Text shown before the coordinates. Pass an empty string for numbers only. */
  prefix?: string
  className?: string
}

/**
 * Live pointer telemetry — normalized viewport coordinates.
 *
 * Renders REST on the server and on first paint so hydration matches, then
 * writes straight to the text node on rAF. Deliberately never goes through
 * state: a mousemove-rate readout costs zero React renders.
 *
 * Inert on coarse pointers and under prefers-reduced-motion — the label holds
 * its resting value instead of flickering. Decorative, so aria-hidden.
 */
export function CursorReadout({ prefix = 'TRACK //', className = '' }: CursorReadoutProps) {
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = valueRef.current
    if (!node) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = 0
    let y = 0
    let rafId = 0
    let queued = false

    const flush = () => {
      queued = false
      node.textContent = `${x.toFixed(3)}, ${y.toFixed(3)}`
    }

    const onMove = (e: MouseEvent) => {
      x = e.clientX / window.innerWidth
      y = e.clientY / window.innerHeight
      if (!queued) {
        queued = true
        rafId = requestAnimationFrame(flush)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <span className={clsx('inline-flex items-center gap-1.5', className)} aria-hidden="true">
      {prefix && <span>{prefix}</span>}
      <span ref={valueRef} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {REST}
      </span>
    </span>
  )
}
