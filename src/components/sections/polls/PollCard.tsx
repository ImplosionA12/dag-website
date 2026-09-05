'use client'

import { useEffect, useState } from 'react'
import { Poll, PollType } from '@/types/polls'
import { Surface } from '@/components/ui/Surface'
import { HudLabel } from '@/components/ui/HudLabel'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { AnimatedBar } from '@/components/ui/AnimatedBar'
import { GhostButton } from '@/components/ui/GhostButton'
import { castVote, getStoredVote, VoteResult, VOTED_CHOICE_UNKNOWN } from '@/lib/vote'
import { VoteOptions } from './VoteOptions'

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

const FAILURE_COPY: Partial<Record<VoteResult, string>> = {
  closed: 'This poll closed before your vote landed.',
  error: 'Vote failed to send. Check your connection and try again.',
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
  /** Pulls fresh tallies after a vote so the bars reflect it immediately. */
  onVoted?: () => void
}

/**
 * Live-vote panel. An open poll this browser has not voted on shows a ballot; everything
 * else shows bars. The leading option takes the type accent, and a closed poll's winner is
 * the page's one gold moment.
 */
export function PollCard({ poll, onVoted }: PollCardProps) {
  const isOpen = poll.status === 'open'
  const accent = TYPE_COLORS[poll.type]
  const maxVotes = Math.max(...poll.options.map(o => o.votes), 1)

  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [failure, setFailure] = useState<VoteResult | null>(null)
  const [alreadyVoted, setAlreadyVoted] = useState(false)

  // Read after mount only: localStorage does not exist during SSR, and branching on it
  // during render would make the server and client markup disagree.
  useEffect(() => {
    const stored = getStoredVote(poll.id)
    setVotedFor(stored)
    setAlreadyVoted(stored === VOTED_CHOICE_UNKNOWN)
  }, [poll.id])

  async function handleVote(optionId: string) {
    if (pending) return

    setPending(optionId)
    setFailure(null)

    const result = await castVote(poll.id, optionId)
    setPending(null)

    if (result === 'ok' || result === 'already-voted') {
      // A rejected duplicate still means a real vote by this browser exists, so the ballot
      // closes either way. The recorded choice is only known when this click is the one that
      // counted; otherwise the card shows results with no marker rather than the wrong one.
      setVotedFor(result === 'ok' ? optionId : VOTED_CHOICE_UNKNOWN)
      setAlreadyVoted(result === 'already-voted')
      onVoted?.()
      return
    }

    setFailure(result)
  }

  const showBallot = isOpen && votedFor === null

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

        {/* Ballot before voting, results after */}
        {showBallot ? (
          <VoteOptions
            options={poll.options}
            accent={accent}
            pending={pending}
            disabled={pending !== null}
            onVote={handleVote}
          />
        ) : (
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
                  label={option.id === votedFor ? `${option.label} ◂ YOUR VOTE` : option.label}
                  percentage={option.percentage}
                  color={barColor}
                  readout={`${option.percentage}% · ${option.votes}`}
                  delay={i * 0.06}
                />
              )
            })}
          </div>
        )}

        {failure && (
          <p className="type-label" role="status" style={{ color: 'var(--game-valorant, #FF4655)' }}>
            {FAILURE_COPY[failure]}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4 flex-wrap pt-2">
          <span className="type-label" style={{ color: 'var(--text-lo)' }}>
            {poll.total_voters} VOTER{poll.total_voters !== 1 ? 'S' : ''}
            {poll.ends_at && isOpen && ` // ENDS ${formatEndsAt(poll.ends_at).toUpperCase()}`}
            {!isOpen && ' // POLL CLOSED'}
          </span>

          {isOpen && votedFor !== null && (
            <span className="type-label" style={{ color: accent }}>
              {alreadyVoted ? 'ALREADY VOTED' : 'VOTE RECORDED'}
            </span>
          )}

          {/* A poll can still point at a Google Form — the sheet-era path stays usable. */}
          {isOpen && poll.form_url && poll.form_url !== '#' && (
            <GhostButton href={poll.form_url}>OPEN FORM</GhostButton>
          )}
        </div>
      </div>
    </Surface>
  )
}
