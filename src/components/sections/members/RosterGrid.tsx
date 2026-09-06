'use client'

import { Member } from '@/types'
import { OperatorCard } from './OperatorCard'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'

interface RosterGridProps {
  members: Member[]
}

/**
 * "SELECT YOUR OPERATOR" — character-select roster grid.
 *
 * The roster is passed in rather than imported: it comes from the database now, so this
 * component renders whatever the club currently is instead of whatever was true at build.
 */
export function RosterGrid({ members }: RosterGridProps) {
  if (members.length === 0) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <EmptyState
          title="NO DATA // STANDBY"
          message="The roster is not available right now. Check back shortly."
        />
      </div>
    )
  }

  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto">
      <SectionReveal>
        <div className="flex items-baseline justify-between mb-10">
          <HudLabel>CORE TEAM // {String(members.length).padStart(2, '0')} OPERATORS</HudLabel>
          <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
            ROSTER V1.0
          </span>
        </div>
      </SectionReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member, i) => (
          <SectionReveal key={member.name} delay={i * 0.07} className="h-full">
            <OperatorCard member={member} index={i} />
          </SectionReveal>
        ))}
      </div>
    </div>
  )
}
