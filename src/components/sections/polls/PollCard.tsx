'use client'

import { Poll, PollType } from '@/types/polls'
import { Surface } from '@/components/ui/Surface'
import { HudLabel } from '@/components/ui/HudLabel'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { AnimatedBar } from '@/components/ui/AnimatedBar'
import { GhostButton } from '@/components/ui/GhostButton'

const TYPE_LABELS: Record<PollType, string> = {
  event: 'EVENT',
  general: 'GENERAL',
  animation: 'ANIMATION',
}

const TYPE_COLORS: Record<PollType, string> = {
  event: 'var(--violet-300)',
  general: 'var(--game-bgmi)',
  animation: 'var(--game-anime)',
}

function formatEndsAt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

interface PollCardProps {
  poll: Poll
}

/**
 * Live-vote panel. The leading option's bar takes the type accent;
 * a closed poll's winner is the page's one gold moment.
 */
export function PollCard({ poll }: PollCardProps) {
  const isOpen = poll.status === 'open'
  const accent = TYPE_COLORS[poll.type]
  const maxVotes = Math.max(...poll.options.map(o => o.votes), 1)

  return (
    <Surface edge={isOpen ? accent : undefined} className="h-full">
      <div className="flex flex-col gap-5 p-7 h-full" style={{ opacity: isOpen ? 1 : 0.75 }}>
        {/* Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className="type-label px-2 py-0.5"
            style={{ color: accent, border: `1px solid ${accent}40` }}
          >
            {TYPE_LABELS[poll.type]}
          </span>
          <SeasonBadge season={poll.season} />
          <HudLabel
            live={isOpen}
            color={isOpen ? '#4ADE80' : 'var(--text-lo)'}
            className="ml-auto"
          >
            {isOpen ? 'LIVE' : 'CLOSED'}
          </HudLabel>
        </div>

        {/* Title + description */}
        <div>
          <h3 className="type-h3 mb-1.5" style={{ color: 'var(--text-hi)' }}>
            {poll.title}
          </h3>
          {poll.description && (
            <p className="type-body" style={{ color: 'var(--text-mid)', fontSize: '0.84rem' }}>
              {poll.description}
            </p>
          )}
        </div>

        {/* Bars */}
        <div className="grid gap-4">
          {poll.options.map((option, i) => {
            const isLeader = option.votes === maxVotes && option.votes > 0
            // Gold only when the poll is decided — the winner's victory moment
            const barColor = isLeader
              ? isOpen
                ? accent
                : 'var(--gold-400)'
              : 'var(--text-lo)'
            return (
              <AnimatedBar
                key={option.id}
                label={option.label}
                percentage={option.percentage}
                color={barColor}
                readout={`${option.percentage}% · ${option.votes}`}
                delay={i * 0.06}
              />
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4 flex-wrap pt-2">
          <span className="type-label" style={{ color: 'var(--text-lo)' }}>
            {poll.total_voters} VOTER{poll.total_voters !== 1 ? 'S' : ''}
            {poll.ends_at && isOpen && ` // ENDS ${formatEndsAt(poll.ends_at).toUpperCase()}`}
            {!isOpen && ' // POLL CLOSED'}
          </span>

          {isOpen && poll.form_url && poll.form_url !== '#' ? (
            <GhostButton href={poll.form_url}>CAST VOTE</GhostButton>
          ) : isOpen && poll.form_url === '#' ? (
            <span className="type-label px-4 py-2" style={{ color: 'var(--text-lo)', border: '1px solid var(--line-1)' }}>
              VOTE LINK PENDING
            </span>
          ) : null}
        </div>
      </div>
    </Surface>
  )
}
