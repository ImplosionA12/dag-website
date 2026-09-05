'use client'

import { PollOption } from '@/types/polls'

interface VoteOptionsProps {
  options: PollOption[]
  accent: string
  pending: string | null
  disabled: boolean
  onVote: (optionId: string) => void
}

/**
 * The ballot itself — one button per option, shown before this browser has voted.
 *
 * Counts are deliberately absent here. Showing the running tally next to an unmarked ballot
 * is a nudge, and on a club poll about favourite games it would decide the result as much as
 * opinion does. The bars appear the moment a vote is cast.
 */
export function VoteOptions({ options, accent, pending, disabled, onVote }: VoteOptionsProps) {
  return (
    <div className="grid gap-2.5" role="group" aria-label="Choose an option">
      {options.map(option => {
        const isPending = pending === option.id

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onVote(option.id)}
            disabled={disabled}
            aria-busy={isPending}
            className="vote-option type-body text-left w-full px-4 py-3 transition-colors duration-150"
            style={{
              color: 'var(--text-hi)',
              border: `1px solid ${isPending ? accent : 'var(--line-2)'}`,
              background: isPending ? `${accent}1A` : 'transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled && !isPending ? 0.55 : 1,
              // The accent is set as a custom property so the hover rule in globals.css can
              // reach it — a :hover border colour cannot be written inline.
              ['--vote-accent' as string]: accent,
            }}
          >
            <span className="flex items-center justify-between gap-3">
              <span>{option.label}</span>
              <span className="type-label" style={{ color: isPending ? accent : 'var(--text-lo)' }}>
                {isPending ? 'CASTING…' : 'VOTE'}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
