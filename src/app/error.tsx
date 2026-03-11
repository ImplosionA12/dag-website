'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[DAG Error]', error)
  }, [error])

  return (
    <div
      className="page-content flex flex-col items-center justify-center text-center px-6"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,70,85,0.05) 0%, transparent 70%),
          var(--bg-void)
        `,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-orbitron)',
          fontSize: 'clamp(3rem, 12vw, 6rem)',
          fontWeight: 700,
          color: 'var(--valorant-color)',
          lineHeight: 1,
          opacity: 0.15,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        ERR
      </p>

      <h1
        className="text-page-heading -mt-2"
        style={{ color: 'var(--text-primary)' }}
      >
        System Failure
      </h1>

      <p
        className="text-body mt-4 max-w-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Something went wrong in the arena. The system logged the incident.
      </p>

      <button
        onClick={reset}
        className="mt-10 inline-flex items-center gap-2 text-label transition-colors duration-150"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--gold-core)',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        ↺ Try Again
      </button>
    </div>
  )
}
