'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { loadGsap } from '@/lib/motion/gsap'

// Type-only derivations — erased at compile time, so GSAP stays dynamic-only.
type GsapInstance = Awaited<ReturnType<typeof loadGsap>>['gsap']
type GsapTimeline = ReturnType<GsapInstance['timeline']>
type GsapContext = ReturnType<GsapInstance['context']>

interface PinnedSceneProps {
  children: React.ReactNode
  className?: string
  /** Scroll distance (in viewport heights) the pin holds for */
  lengthVh?: number
  /**
   * Builds the scrubbed timeline. Receives the gsap instance, the pinned
   * element, and a timeline already wired to a scrub ScrollTrigger.
   */
  build: (gsap: GsapInstance, el: HTMLDivElement, tl: GsapTimeline) => void
  /** Re-run ScrollTrigger.refresh() when these change (async data resizing the page) */
  refreshDeps?: unknown[]
}

/**
 * Generic pinned, scrubbed scroll scene. Under reduced motion (or mobile)
 * it renders children statically — no pin, no GSAP load at all.
 */
export function PinnedScene({
  children,
  className = '',
  lengthVh = 1,
  build,
  refreshDeps = [],
}: PinnedSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const buildRef = useRef(build)
  buildRef.current = build

  useEffect(() => {
    if (reducedMotion) return

    const el = ref.current
    if (!el) return

    let ctx: GsapContext | undefined
    let cancelled = false

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: `+=${lengthVh * 100}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
        buildRef.current(gsap, el, tl)
      }, el)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [reducedMotion, lengthVh])

  // Async data (events, standings) loading later changes page height —
  // recompute trigger positions when it lands.
  useEffect(() => {
    if (reducedMotion) return
    loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refreshDeps)

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
