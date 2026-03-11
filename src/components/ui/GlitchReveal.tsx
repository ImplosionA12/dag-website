'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GlitchRevealProps {
  onComplete?: () => void
  className?: string
  /** Override the font-size of the DAG characters. Defaults to text-hero CSS class. */
  fontSize?: string
}

const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

/**
 * One-time DAG logo glitch reveal on page load.
 * Sequence:
 * 1. Screen black (0–300ms)
 * 2. Characters scramble fast (300–1200ms)
 * 3. Resolve left to right D→A→G (1200–1600ms)
 * 4. Full name fades in (1600–1800ms)
 * 5. onComplete fires (2100ms)
 *
 * Used ONCE in Hero — never in navbar or elsewhere.
 */
export function GlitchReveal({ onComplete, className = '', fontSize }: GlitchRevealProps) {
  const reducedMotion = useReducedMotion()
  // Initialize to final chars so SSR and client hydration match.
  // The scramble starts in useEffect (client-only).
  const [chars, setChars] = useState(['D', 'A', 'G'])
  const [resolvedCount, setResolvedCount] = useState(0)
  const [showFullName, setShowFullName] = useState(false)
  const scrambleRef = useRef<NodeJS.Timeout | null>(null)
  const target = ['D', 'A', 'G']

  useEffect(() => {
    if (reducedMotion) {
      setChars(['D', 'A', 'G'])
      setResolvedCount(3)
      setShowFullName(true)
      onComplete?.()
      return
    }

    const scrambleStart = setTimeout(() => {
      scrambleRef.current = setInterval(() => {
        setChars(target.map((_, i) => i < resolvedCount ? target[i] : randomChar()))
      }, 50)
    }, 300)

    const resolveStart = setTimeout(() => {
      if (scrambleRef.current) clearInterval(scrambleRef.current)

      const resolveChar = (index: number) => {
        setTimeout(() => {
          setResolvedCount(index + 1)
          setChars(prev => {
            const next = [...prev]
            next[index] = target[index]
            return next
          })
        }, index * 133)
      }

      resolveChar(0)
      resolveChar(1)
      resolveChar(2)
    }, 1200)

    const fullNameStart = setTimeout(() => {
      setShowFullName(true)
    }, 1600)

    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 2100)

    return () => {
      clearTimeout(scrambleStart)
      clearTimeout(resolveStart)
      clearTimeout(fullNameStart)
      clearTimeout(completeTimer)
      if (scrambleRef.current) clearInterval(scrambleRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* DAG characters */}
      <div className="flex items-center" aria-label="DAG" style={{ gap: '0.02em' }}>
        {chars.map((char, i) => (
          <span
            key={i}
            style={{
              fontSize: fontSize || 'clamp(7rem, 22vw, 16rem)',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              lineHeight: 0.85,
              display: 'inline-block',
              color: i < resolvedCount ? 'var(--violet-bright)' : 'rgba(157,78,221,0.4)',
              transition: i < resolvedCount ? 'color 0.15s ease, text-shadow 0.15s ease' : 'none',
              textShadow: i < resolvedCount
                ? '0 0 40px rgba(157,78,221,0.6), 0 0 80px rgba(157,78,221,0.2)'
                : 'none',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Full name */}
      <p
        style={{
          color: 'var(--text-secondary)',
          opacity: showFullName ? 1 : 0,
          transform: showFullName ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          letterSpacing: '0.3em',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 700,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          marginTop: '0.75rem',
        }}
      >
        DRUSHYA ANIMATIONS &amp; GAMING
      </p>
    </div>
  )
}
