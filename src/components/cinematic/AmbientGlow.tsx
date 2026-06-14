'use client'

import { useEffect, useRef, useState } from 'react'

const GLOW_SIZE = 720
const LERP = 0.06

/**
 * Mouse-reactive ambient light — a soft violet glow that drifts after the
 * cursor, screen-blended over the page like light hitting a CRT.
 * Fine-pointer devices only; skipped under reduced motion.
 */
export function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (finePointer && !reduced) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let gx = mx
    let gy = my
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      gx += (mx - gx) * LERP
      gy += (my - gy) * LERP
      el.style.transform = `translate(${gx - GLOW_SIZE / 2}px, ${gy - GLOW_SIZE / 2}px)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 85 }}
    >
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(123,47,190,0.09) 0%, rgba(123,47,190,0.03) 45%, transparent 70%)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
