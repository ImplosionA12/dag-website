import type { Metadata } from 'next'
import { Hero } from '@/components/sections/home/Hero'
import { NextEventSpotlight } from '@/components/sections/home/NextEventSpotlight'
import { WhatIsDAG } from '@/components/sections/home/WhatIsDAG'
import { StatCounter } from '@/components/ui/StatCounter'
import { NeonButton } from '@/components/ui/NeonButton'
import { SectionReveal } from '@/components/ui/SectionReveal'

export const metadata: Metadata = {
  title: 'DAG — Enter the Arena',
  description: 'DAG — Drushya Animations & Gaming. Where Gaming Meets Animation. Season 1 is active.',
}

export default function HomePage() {
  return (
    <div>
      {/* 1 — Hero: particle sphere + glitch reveal */}
      <Hero />

      {/* 2 — Next event: cinematic spotlight card */}
      <NextEventSpotlight />

      {/* 3 — What is DAG: two wings */}
      <WhatIsDAG />

      {/* 4 — Season stats */}
      <section
        className="px-6 md:px-10 py-section"
        style={{
          background: 'linear-gradient(180deg, var(--bg-void) 0%, rgba(74,26,122,0.18) 50%, var(--bg-void) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <p className="text-label text-center mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
              BY THE NUMBERS
            </p>
            <h2 className="text-section-heading text-center mb-16" style={{ color: 'var(--text-primary)' }}>
              Season Stats
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            <StatCounter value={0} label="EVENTS HELD" />
            <StatCounter value={0} label="PLAYERS COMPETED" />
            <StatCounter value={1} label="SEASONS" />
            <StatCounter value={0} label="CHAMPIONS CROWNED" />
          </div>
        </div>
      </section>

      {/* 5 — Join Us */}
      <section
        className="px-6 md:px-10 py-section-lg flex flex-col items-center justify-center text-center"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 50%, rgba(74,26,122,0.35) 0%, transparent 70%),
            var(--bg-primary)
          `,
        }}
      >
        <SectionReveal distance={24}>
          <p className="text-label mb-4" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
            WANT TO PLAY FOR DAG?
          </p>
          <h2
            className="text-page-heading mb-6"
            style={{ color: 'var(--text-primary)', maxWidth: '700px' }}
          >
            Join the<br />
            <span className="text-violet-gradient">Squad</span>
          </h2>
          <p
            className="text-body mb-10"
            style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}
          >
            DAG is more than a club — it is a competitive stage and a creative studio.
            Whether you grind ranked or create worlds frame by frame, there is a wing for you.
          </p>
          <NeonButton href={process.env.NEXT_PUBLIC_JOIN_FORM_URL || '#'} size="lg" pulse={false}>
            JOIN THE CLUB
          </NeonButton>
        </SectionReveal>
      </section>
    </div>
  )
}
