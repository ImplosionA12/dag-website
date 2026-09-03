'use client'

import { useEffect, useState } from 'react'
import { daysRemaining } from '@/lib/utils'

interface MissionCountdownProps {
  date: string
  accent: string
}

/**
 * Days-to-drop readout for an upcoming mission.
 *
 * Computed post-mount only: the server renders on a different clock (and in UTC), so
 * counting during SSR produces a number that can disagree with the client's and trip a
 * hydration mismatch. Renders a dash until mounted.
 */
export function MissionCountdown({ date, accent }: MissionCountdownProps) {
  const [days, setDays] = useState<number | null | undefined>(undefined)

  useEffect(() => {
    setDays(daysRemaining(date))
  }, [date])

  const value =
    days === undefined ? '—' : days === null ? '—' : days === 0 ? 'NOW' : String(days).padStart(2, '0')

  return (
    <div className="flex items-baseline gap-3">
      <span
        style={{
          fontFamily: 'var(--font-hud), monospace',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          lineHeight: 1,
          color: accent,
        }}
      >
        {value}
      </span>
      <span className="type-label" style={{ color: 'var(--text-lo)' }}>
        {days === 0 ? 'TODAY' : days === 1 ? 'DAY OUT' : 'DAYS OUT'}
      </span>
    </div>
  )
}
