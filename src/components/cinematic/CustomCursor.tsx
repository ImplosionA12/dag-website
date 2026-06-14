'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor — instant dot + lagging targeting ring.
 * Expands over interactive elements; applies magnetic pull to
 * [data-magnetic] targets. Mounts only on fine-pointer devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Fine pointer only — touch devices never see this
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let ringScale = 1
    let targetScale = 1
    let rafId = 0
    let magnetTarget: HTMLElement | null = null

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`

      // Magnetic pull on CTA targets
      if (magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (mx - cx) * 0.18
        const dy = (my - cy) * 0.18
        magnetTarget.style.transform = `translate(${dx}px, ${dy}px)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        'a, button, [role="button"], input, textarea, select'
      )
      targetScale = el ? 2.2 : 1

      const magnet = (e.target as HTMLElement).closest<HTMLElement>('[data-magnetic]')
      if (magnet !== magnetTarget) {
        if (magnetTarget) magnetTarget.style.transform = ''
        magnetTarget = magnet
        if (magnetTarget) magnetTarget.style.transition = 'transform 0.18s ease-out'
      }
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ringScale += (targetScale - ringScale) * 0.18
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${ringScale})`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (magnetTarget) magnetTarget.style.transform = ''
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="z-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--text-hi)',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="z-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid var(--zone-accent)',
          opacity: 0.7,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </>
  )
}
