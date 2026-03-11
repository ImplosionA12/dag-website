'use client'

import { MEMBERS } from '@/data/members'
import { Member } from '@/types'
import { TiltCard } from '@/components/ui/TiltCard'
import { GameBadge } from '@/components/ui/GameBadge'
import { motion } from 'framer-motion'

function MemberBadges({ member }: { member: Member }) {
  // No games listed — render nothing
  if (member.games.length === 0) return null

  // Only "Other" + has a note — render note as a custom badge
  if (member.games.length === 1 && member.games[0] === 'Other' && member.note) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
        <span
          className="inline-flex items-center rounded-sm font-medium px-2 py-0.5 text-[0.6rem]"
          style={{
            backgroundColor: 'rgba(123,47,190,0.15)',
            border: '1px solid rgba(157,78,221,0.4)',
            color: 'var(--violet-bright)',
            fontFamily: 'var(--font-orbitron), monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {member.note}
        </span>
      </div>
    )
  }

  // Standard game badges
  return (
    <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
      {member.games.map(g => (
        <GameBadge key={g} game={g} size="sm" />
      ))}
    </div>
  )
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const isPresident = !!member.isPresident

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      className="h-full"
    >
      <TiltCard maxTilt={isPresident ? 5 : 8} className="h-full">
        <div
          className="relative rounded-lg h-full flex flex-col"
          style={{
            padding: isPresident ? '1.75rem 2rem' : '1.5rem',
            background: isPresident
              ? 'linear-gradient(135deg, rgba(255,183,3,0.08) 0%, rgba(123,47,190,0.1) 100%)'
              : 'rgba(123,47,190,0.04)',
            border: isPresident
              ? '1px solid rgba(255,183,3,0.35)'
              : '1px solid rgba(157,78,221,0.15)',
            boxShadow: isPresident ? '0 0 40px rgba(255,183,3,0.08)' : 'none',
          }}
        >
          {/* President gold glow */}
          {isPresident && (
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              aria-hidden
              style={{
                background:
                  'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,183,3,0.1) 0%, transparent 70%)',
              }}
            />
          )}

          <div className="relative flex flex-col h-full">
            {/* President badge */}
            {isPresident && (
              <span
                className="self-start mb-3"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.22em',
                  color: 'var(--gold-core)',
                  background: 'rgba(255,183,3,0.12)',
                  border: '1px solid rgba(255,183,3,0.4)',
                  borderRadius: '2px',
                  padding: '0.25rem 0.6rem',
                  textTransform: 'uppercase',
                }}
              >
                PRESIDENT
              </span>
            )}

            {/* Name */}
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontWeight: 700,
                fontSize: isPresident
                  ? 'clamp(1.5rem, 3vw, 2rem)'
                  : 'clamp(1.1rem, 2vw, 1.4rem)',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                marginBottom: '0.4rem',
              }}
            >
              {member.name}
            </p>

            {/* Role */}
            <p
              className="text-body mb-4"
              style={{
                color: isPresident ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontSize: isPresident ? '0.85rem' : '0.78rem',
              }}
            >
              {member.role}
            </p>

            {/* Note (President only — shown as a subtle line) */}
            {isPresident && member.note && (
              <p
                className="text-body mb-4"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                {member.note}
              </p>
            )}

            {/* Game badges / custom badge / nothing */}
            <MemberBadges member={member} />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export function MembersContent() {
  const president = MEMBERS.find(m => m.isPresident)
  const team = MEMBERS.filter(m => !m.isPresident)

  return (
    <div className="px-6 md:px-10 pb-section max-w-7xl mx-auto">

      {/* ── President ─────────────────────────────────────────────────────── */}
      {president && (
        <section className="mb-16">
          <div className="max-w-sm">
            <MemberCard member={president} index={0} />
          </div>
        </section>
      )}

      {/* Divider */}
      <div
        className="mb-16"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(255,183,3,0.2), rgba(157,78,221,0.2), transparent)',
        }}
      />

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section>
        <p
          className="text-label mb-3"
          style={{ color: 'var(--violet-bright)', letterSpacing: '0.2em' }}
        >
          CORE TEAM
        </p>
        <h2 className="text-section-heading mb-10" style={{ color: 'var(--text-primary)' }}>
          The Squad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((m, i) => (
            <MemberCard key={m.name} member={m} index={(president ? 1 : 0) + i} />
          ))}
        </div>
      </section>
    </div>
  )
}
