'use client'

import { Member } from '@/types'
import { GameBadge } from '@/components/ui/GameBadge'
import { HudFrame } from '@/components/ui/HudFrame'

interface OperatorCardProps {
  member: Member
  index: number
}

/**
 * Character-select card. The president's tag is a gold victory marker;
 * everyone else runs zone-accent.
 */
export function OperatorCard({ member, index }: OperatorCardProps) {
  const initials = member.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <HudFrame
      className="operator-card relative flex flex-col p-7 h-full transition-transform duration-300"
      tl={`SLOT ${String(index + 1).padStart(2, '0')}`}
    >
      <div className="flex items-start justify-between gap-4 pt-4 mb-6">
        {/* Initials block — avatar stand-in */}
        <span
          aria-hidden="true"
          className="diag flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            background: 'var(--surface-3)',
            border: '1px solid var(--line-2)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: 'var(--zone-accent)',
          }}
        >
          {initials}
        </span>

        <div className="flex flex-col items-end gap-1.5">
          {member.isPresident && (
            <span
              className="type-label px-2 py-0.5"
              style={{ background: 'var(--gold-400)', color: 'var(--void)' }}
            >
              PRESIDENT
            </span>
          )}
          {member.isFounder && (
            <span
              className="type-label px-2 py-0.5"
              style={{ border: '1px solid var(--zone-accent)', color: 'var(--zone-accent)' }}
            >
              FOUNDER
            </span>
          )}
        </div>
      </div>

      <h3
        className="mb-1"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 2.6vw, 1.9rem)',
          textTransform: 'uppercase',
          lineHeight: 1,
          color: 'var(--text-hi)',
        }}
      >
        {member.name}
      </h3>

      <p className="type-label mb-4" style={{ color: 'var(--text-mid)' }}>
        {member.role.toUpperCase()}
      </p>

      {member.note && (
        <p className="type-body mb-4" style={{ color: 'var(--text-lo)', fontSize: '0.82rem' }}>
          {member.note}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        {member.games.length > 0 ? (
          member.games.map(game => <GameBadge key={game} game={game} />)
        ) : (
          <span className="type-label" style={{ color: 'var(--text-lo)' }}>
            SUPPORT OPS
          </span>
        )}
      </div>
    </HudFrame>
  )
}
