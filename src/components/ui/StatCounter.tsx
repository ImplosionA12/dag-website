'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { clsx } from '@/lib/utils'

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
  className?: string
}

/**
 * Telemetry stat — Chakra Petch tabular numerals, rAF count-up on first view.
 * Under reduced motion (or before IntersectionObserver fires on SSR HTML)
 * the final value renders immediately.
 */
export function StatCounter({ value, label, suffix = '', className = '' }: StatCounterProps) {
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(value)
  const [armed, setArmed] = useState(false)
  const hasAnimated = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  // Arm the animation only on capable clients — SSR markup shows the value.
  // useReducedMotion starts false and may flip true after mount, so both
  // branches must settle the count explicitly.
  useEffect(() => {
    if (hasAnimated.current) return
    if (reducedMotion) {
      setCount(value)
      setArmed(false)
    } else {
      setCount(0)
      setArmed(true)
    }
  }, [reducedMotion, value])

  useEffect(() => {
    if (!armed || hasAnimated.current || typeof IntersectionObserver === 'undefined') return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateCount(value, 1800, setCount)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [armed, value])

  return (
    <div ref={ref} className={clsx('flex flex-col items-center gap-3', className)}>
      <span
        style={{
          fontFamily: 'var(--font-hud), monospace',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          fontSize: 'clamp(2.6rem, 6vw, 4.6rem)',
          lineHeight: 1,
          color: 'var(--text-hi)',
        }}
      >
        {count}
        {suffix}
      </span>
      <span className="type-label" style={{ color: 'var(--text-lo)' }}>
        {label}
      </span>
    </div>
  )
}

function animateCount(to: number, duration: number, setter: (v: number) => void) {
  const start = performance.now()

  function update(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(to * eased))
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}
