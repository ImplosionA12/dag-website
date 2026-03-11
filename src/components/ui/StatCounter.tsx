'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
  className?: string
}

export function StatCounter({ value, label, suffix = '', className = '' }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setCount(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCount(0, value, 2000, setCount)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, reducedMotion, hasAnimated])

  return (
    <div ref={ref} className={`flex flex-col items-center gap-2 ${className}`}>
      <span
        className="text-gold-core text-data-bold"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontFamily: 'var(--font-orbitron)',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {count}{suffix}
      </span>
      <span className="text-label" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

function animateCount(
  from: number,
  to: number,
  duration: number,
  setter: (v: number) => void
) {
  const startTime = performance.now()

  function update(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(from + (to - from) * eased))
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}
