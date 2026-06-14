'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Full-screen film grain + scanline overlay — single composited layer.
 * Static (non-animated) frame under reduced motion; grain only flickers
 * on capable devices.
 */
export function FilmGrain() {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="z-grain"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.04,
        overflow: 'hidden',
      }}
    >
      <div className={`grain-texture ${reducedMotion ? '' : 'animate-grain'}`} />
    </div>
  )
}
