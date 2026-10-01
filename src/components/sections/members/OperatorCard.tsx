'use client'

import { Member } from '@/types'
import { GameBadge } from '@/components/ui/GameBadge'
import { HudFrame } from '@/components/ui/HudFrame'
import { MemberPortrait } from '@/components/ui/MemberPortrait'

interface OperatorCardProps {
  member: Member
  index: number
}

/**
 * Character-select card — portrait first. Role tags run zone-accent; gold is
 * reserved for victory, and a committee role is not a win.
 */
export function OperatorCard({ member, index }: OperatorCardProps) {
  return (
    <HudFrame
      className="operator-card relative flex flex-col p-7 h-full transition-transform duration-300"
      tl={`SLOT ${String(index + 1).padStart(2, '0')}`}
    >
      <div className="relative mt-4 mb-6">
        <MemberPortrait
          name={member.name}
          games={member.games}
          photoUrl={member.photoUrl}
          className="aspect-[4/3]"
        />

        {(member.isPresident || member.isFounder) && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {member.isPresident && (
              <span
                className="type-label px-2 py-0.5"
                style={{ background: 'var(--zone-accent)', color: 'var(--void)' }}
              >
                PRESIDENT
              </span>
            )}
            {member.isFounder && (
              <span
                className="type-label px-2 py-0.5"
                style={{
                  border: '1px solid var(--zone-accent)',
                  color: 'var(--text-hi)',
                  background: 'rgba(5,4,8,0.6)',
                }}
              >
                FOUNDER
              </span>
            )}
          </div>
        )}
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
