'use client'

import { useEffect } from 'react'
import { GhostButton } from '@/components/ui/GhostButton'
import { HudLabel } from '@/components/ui/HudLabel'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div
      className="pt-page-top flex flex-col items-center justify-center text-center px-gutter"
      style={{ minHeight: '100vh', background: 'var(--void)' }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(7rem, 24vw, 18rem)',
          lineHeight: 0.9,
          color: 'transparent',
          WebkitTextStroke: '2px var(--game-valorant)',
        }}
      >
        ERR
      </span>
      <HudLabel color="var(--game-valorant)" className="mt-6">
        SYSTEM FAILURE // FEED INTERRUPTED
      </HudLabel>
      <p className="type-body mt-4 mb-10" style={{ color: 'var(--text-mid)', maxWidth: 420 }}>
        Something broke mid-broadcast. The crash has been logged — try re-running the sequence.
      </p>
      <GhostButton onClick={reset}>TRY AGAIN</GhostButton>
    </div>
  )
}
