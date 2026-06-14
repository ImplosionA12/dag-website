import type { Metadata } from 'next'
import { GhostButton } from '@/components/ui/GhostButton'
import { HudLabel } from '@/components/ui/HudLabel'

export const metadata: Metadata = {
  title: '404 — Zone Not Found',
  description: 'This arena sector does not exist.',
}

export default function NotFound() {
  return (
    <div
      className="pt-page-top flex flex-col items-center justify-center text-center px-gutter"
      style={{ minHeight: '100vh', background: 'var(--void)' }}
    >
      <span
        aria-hidden="true"
        className="animate-flicker"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(8rem, 28vw, 20rem)',
          lineHeight: 0.9,
          color: 'transparent',
          WebkitTextStroke: '2px var(--violet-300)',
        }}
      >
        404
      </span>
      <HudLabel className="mt-6">ZONE NOT FOUND // SECTOR UNMAPPED</HudLabel>
      <p className="type-body mt-4 mb-10" style={{ color: 'var(--text-mid)', maxWidth: 420 }}>
        This arena sector does not exist. The map ends here — head back to base.
      </p>
      <GhostButton href="/">RETURN TO BASE</GhostButton>
    </div>
  )
}
