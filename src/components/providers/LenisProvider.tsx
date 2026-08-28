'use client'

import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { setLenis, getLenis } from '@/lib/motion/lenis'

/**
 * Initializes Lenis smooth scrolling. Renders nothing.
 * Skipped entirely under reduced motion / mobile (<768px) — native scroll there.
 * If GSAP loads later, its ticker takes over the raf loop (see lib/motion/gsap.ts);
 * until then Lenis runs its own loop.
 */
export function LenisProvider() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let rafId = 0
    let destroyed = false

    const init = async () => {
      const { default: Lenis } = await import('lenis')
      if (destroyed) return

      const lenis = new Lenis({
        // 0.1 closed only 10% of the gap per frame — roughly 370ms to catch up
        // to the wheel, which read as the page lagging behind the input.
        lerp: 0.2,
        anchors: true,
      })
      setLenis(lenis)

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
      destroyed = true
      cancelAnimationFrame(rafId)
      getLenis()?.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  return null
}
