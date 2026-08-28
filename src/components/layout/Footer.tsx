'use client'

import Link from 'next/link'
import { GameBadge } from '@/components/ui/GameBadge'
import { HudLabel } from '@/components/ui/HudLabel'
import { DATA_CONFIG } from '@/config/data'
import { GameType } from '@/types'

const FOOTER_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Events',       href: '/events' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Members',      href: '/members' },
  { label: 'Polls',        href: '/polls' },
  { label: 'About',        href: '/about' },
]

const GAMES: GameType[] = ['FF', 'BGMI', 'Valorant', 'Anime']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Faded rule, no fill. An opaque --void panel here occluded the fixed
          AmbientField and put a hard tonal step at the footer's top edge. */}
      <div className="hud-rule absolute top-0 left-0 right-0" aria-hidden="true" />

      {/* Giant clipped wordmark bleeding off the bottom */}
      <p
        aria-hidden="true"
        className="select-none pointer-events-none"
        style={{
          position: 'absolute',
          bottom: '-0.28em',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(8rem, 28vw, 24rem)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          color: 'transparent',
          WebkitTextStroke: '1px var(--line-1)',
          whiteSpace: 'nowrap',
        }}
      >
        DAG
      </p>

      <div className="relative max-w-7xl mx-auto px-gutter pt-16 pb-28 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 900,
                color: 'var(--text-hi)',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              {DATA_CONFIG.club.name}
            </p>
            <p className="mt-3 type-label" style={{ color: 'var(--text-lo)' }}>
              {DATA_CONFIG.club.fullName.toUpperCase()}
            </p>
            <p className="mt-5 type-body" style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>
              {DATA_CONFIG.club.tagline}
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p className="type-label mb-5" style={{ color: 'var(--text-lo)' }}>
              {'// NAVIGATE'}
            </p>
            <ul className="flex flex-col gap-3 list-none" role="list">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="footer-link type-label">
                    {label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Games */}
          <div>
            <p className="type-label mb-5" style={{ color: 'var(--text-lo)' }}>
              {'// GAMES WE PLAY'}
            </p>
            <div className="flex flex-wrap gap-2">
              {GAMES.map(game => (
                <GameBadge key={game} game={game} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry strip */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--line-1)' }}
        >
          <HudLabel>
            {`TRANSMISSION END // © ${year} ${DATA_CONFIG.club.fullName.toUpperCase()}`}
          </HudLabel>
          <HudLabel live>
            {`SZN ${DATA_CONFIG.club.currentSeason.replace('S', '0')} // ACTIVE`}
          </HudLabel>
        </div>
      </div>
    </footer>
  )
}
