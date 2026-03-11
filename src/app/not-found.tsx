import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Zone Not Found',
  description: 'This arena sector does not exist.',
}

export default function NotFound() {
  return (
    <div
      className="page-content flex flex-col items-center justify-center text-center px-6"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(123,47,190,0.06) 0%, transparent 70%),
          var(--bg-void)
        `,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-orbitron)',
          fontSize: 'clamp(5rem, 20vw, 10rem)',
          fontWeight: 700,
          color: 'var(--violet-bright)',
          lineHeight: 1,
          opacity: 0.15,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1
        className="text-page-heading -mt-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Zone Not Found
      </h1>

      <p
        className="text-body mt-4 max-w-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        This sector of the arena doesn&apos;t exist or has been wiped from the records.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-label transition-colors duration-150"
        style={{
          color: 'var(--gold-core)',
          textDecoration: 'none',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        ← Return to Base
      </Link>
    </div>
  )
}
