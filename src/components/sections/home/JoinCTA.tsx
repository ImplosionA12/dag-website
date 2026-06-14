'use client'

import { SectionReveal } from '@/components/ui/SectionReveal'
import { HudLabel } from '@/components/ui/HudLabel'
import { CTAButton } from '@/components/ui/CTAButton'
import { DATA_CONFIG } from '@/config/data'

/**
 * Closing scene — the gold moment of the home page.
 */
export function JoinCTA() {
  return (
    <section
      className="relative flex items-center justify-center px-gutter overflow-hidden"
      style={{
        minHeight: '85vh',
        background: `
          radial-gradient(ellipse 90% 70% at 50% 60%, rgba(74,26,122,0.30) 0%, transparent 65%),
          var(--void)
        `,
      }}
    >
      <div className="scanlines opacity-30" aria-hidden="true" />

      {/* Ghost wordmark behind */}
      <span
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(10rem, 36vw, 30rem)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px var(--line-1)',
          opacity: 0.7,
        }}
      >
        DAG
      </span>

      <div className="relative z-10 flex flex-col items-center text-center py-section">
        <SectionReveal distance={24}>
          <HudLabel className="justify-center">RECRUITMENT // OPEN</HudLabel>
          <h2 className="type-display mt-6 mb-6" style={{ color: 'var(--text-hi)' }}>
            JOIN THE SQUAD
          </h2>
          <p
            className="type-body mb-12 mx-auto"
            style={{ color: 'var(--text-mid)', maxWidth: 480 }}
          >
            DAG is more than a club — it is a competitive stage and a creative studio.
            Whether you grind ranked or build worlds frame by frame, there is a wing for you.
          </p>
          <CTAButton href={DATA_CONFIG.forms.joinUs || '#'} size="lg">
            JOIN THE CLUB
          </CTAButton>
        </SectionReveal>
      </div>
    </section>
  )
}
