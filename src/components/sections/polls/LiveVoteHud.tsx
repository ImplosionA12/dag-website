'use client'

import { usePolls } from '@/hooks/usePolls'
import { PollCard } from './PollCard'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

/**
 * Live vote HUD — usePolls auto-refreshes every 30s, so the bars
 * track the sheet in near-real-time.
 */
export function LiveVoteHud() {
  const { data: polls, loading, refetch } = usePolls()

  if (loading && !polls) {
    return (
      <div
        className="px-gutter pb-section max-w-6xl mx-auto grid md:grid-cols-2 gap-5"
        aria-busy="true"
        aria-label="Loading polls"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-80" />
        ))}
      </div>
    )
  }

  if (!polls || polls.length === 0) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <EmptyState
          title="NO ACTIVE BALLOTS // STANDBY"
          message="No polls running right now. New votes open here when the club has a decision to make."
        />
      </div>
    )
  }

  const open = polls.filter(p => p.status === 'open')
  const closed = polls.filter(p => p.status === 'closed')

  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto">
      <SectionReveal>
        <div className="flex items-baseline justify-between mb-8">
          <HudLabel live>LIVE BALLOTS // {String(open.length).padStart(2, '0')}</HudLabel>
          <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
            AUTO-REFRESH 30S
          </span>
        </div>
      </SectionReveal>

      <div className="grid md:grid-cols-2 gap-5 mb-20">
        {open.map((poll, i) => (
          <SectionReveal key={poll.id} delay={i * 0.07} className="h-full">
            <PollCard poll={poll} onVoted={refetch} />
          </SectionReveal>
        ))}
        {open.length === 0 && (
          <div className="md:col-span-2">
            <EmptyState
              title="NO OPEN BALLOTS"
              message="Every poll is closed. Results below."
            />
          </div>
        )}
      </div>

      {closed.length > 0 && (
        <>
          <SectionReveal>
            <div className="flex items-baseline justify-between mb-8">
              <HudLabel>DECIDED // RESULTS ARCHIVE</HudLabel>
              <span className="type-label hidden sm:block" style={{ color: 'var(--text-lo)' }}>
                {String(closed.length).padStart(2, '0')} CLOSED
              </span>
            </div>
          </SectionReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {closed.map((poll, i) => (
              <SectionReveal key={poll.id} delay={i * 0.07} className="h-full">
                <PollCard poll={poll} onVoted={refetch} />
              </SectionReveal>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
