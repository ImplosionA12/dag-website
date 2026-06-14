'use client'

import { MEMBERS } from '@/data/members'
import { OperatorCard } from './OperatorCard'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'

/**
 * "SELECT YOUR OPERATOR" — character-select roster grid.
 */
export function RosterGrid() {
  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto">
      <SectionReveal>
        <div className="flex items-baseline justify-between mb-10">
          <HudLabel>CORE TEAM // {String(MEMBERS.length).padStart(2, '0')} OPERATORS</HudLabel>
          <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
            ROSTER V1.0
          </span>
        </div>
      </SectionReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MEMBERS.map((member, i) => (
          <SectionReveal key={member.name} delay={i * 0.07} className="h-full">
            <OperatorCard member={member} index={i} />
          </SectionReveal>
        ))}
      </div>
    </div>
  )
}
