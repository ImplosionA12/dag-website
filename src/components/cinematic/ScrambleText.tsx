'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#░▒▓█'

interface ScrambleTextProps {
  text: string
  /** ms before the scramble starts */
  delay?: number
  /** ms per character resolve step */
  speed?: number
  className?: string
  style?: React.CSSProperties
  onComplete?: () => void
}

/**
 * Character-scramble reveal — glyph noise resolves left to right.
 * SSR renders the real text (SEO + hydration safe); randomness only
 * begins post-mount. Skips straight to the text under reduced motion.
 */
export function ScrambleText({
  text,
  delay = 0,
  speed = 35,
  className = '',
  style,
  onComplete,
}: ScrambleTextProps) {
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(text)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (reducedMotion) return

    let frame = 0
    let rafId = 0
    const totalFrames = Math.max(text.length * 2, 14)

    const run = () => {
      const startTimeout = setTimeout(() => {
        const tick = () => {
          frame++
          const resolved = Math.floor((frame / totalFrames) * text.length)
          const next = text
            .split('')
            .map((ch, i) => {
              if (ch === ' ') return ' '
              if (i < resolved) return ch
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            })
            .join('')
          setDisplay(next)

          if (frame < totalFrames) {
            rafId = window.setTimeout(tick, speed) as unknown as number
          } else {
            setDisplay(text)
            onComplete?.()
          }
        }
        tick()
      }, delay)
      timeouts.current.push(startTimeout)
    }

    run()

    const captured = timeouts.current
    return () => {
      captured.forEach(clearTimeout)
      clearTimeout(rafId)
    }
    // onComplete intentionally excluded — fire-once choreography callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, speed, reducedMotion])

  return (
    <span className={className} style={style} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
