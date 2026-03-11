'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Event } from '@/types'
import { EventCard } from './EventCard'

/**
 * Upcoming tournament cards with GSAP scroll-scrubbed animations.
 *
 * Each card:
 *   — rises from below as you scroll to it (scrub-tied, not instant)
 *   — scales/dims slightly as the next card scrolls in on top of it
 *
 * Reduced motion / single card: plain vertical list (no GSAP).
 */
export function StackScrollCards({ events }: { events: Event[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || events.length === 0 || !containerRef.current) return

    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)

      if (!containerRef.current) return

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(
          '[data-ssc]',
          containerRef.current!
        )

        cards.forEach((card, i) => {
          // ── Entry: card rises from below, scrubbed to scroll position ──────
          gsap.from(card, {
            y: 70,
            opacity: 0,
            scale: 0.96,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 38%',
              scrub: 1.4,
            },
          })

          // ── Burial: scale & dim as the next card scrolls over it ──────────
          if (i < cards.length - 1) {
            gsap.to(card, {
              scale: 0.965,
              opacity: 0.55,
              y: -10,
              ease: 'none',
              scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top 78%',
                end: 'top 38%',
                scrub: 1.2,
              },
            })
          }
        })
      }, containerRef)
    })()

    return () => ctx?.revert()
  }, [events, reducedMotion])

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      {events.map(event => (
        <div key={event.id} data-ssc style={{ transformOrigin: 'top center' }}>
          <EventCard event={event} variant="upcoming" />
        </div>
      ))}
    </div>
  )
}
