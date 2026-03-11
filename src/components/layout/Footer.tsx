'use client'

import Link from 'next/link'
import { GameBadge } from '@/components/ui/GameBadge'
import { DATA_CONFIG } from '@/config/data'
import { GameType } from '@/types'

const FOOTER_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Events',       href: '/events' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Members',      href: '/members' },
  { label: 'About',        href: '/about' },
]

const GAMES: GameType[] = ['FF', 'BGMI', 'Valorant', 'Anime']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-void)',
        borderTop: '1px solid rgba(157, 78, 221, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                color: 'var(--violet-bright)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              {DATA_CONFIG.club.name}
            </p>
            <p
              className="mt-2 text-label"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}
            >
              {DATA_CONFIG.club.fullName.toUpperCase()}
            </p>
            <p
              className="mt-4 text-body"
              style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}
            >
              {DATA_CONFIG.club.tagline}
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p className="text-label mb-5" style={{ color: 'var(--text-muted)' }}>Navigate</p>
            <ul className="flex flex-col gap-3 list-none" role="list">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-label transition-colors duration-150"
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      letterSpacing: '0.1em',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--violet-bright)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
                    }}
                  >
                    {label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Games */}
          <div>
            <p className="text-label mb-5" style={{ color: 'var(--text-muted)' }}>Games We Play</p>
            <div className="flex flex-wrap gap-2">
              {GAMES.map(game => (
                <GameBadge key={game} game={game} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(157, 78, 221, 0.1)' }}
        >
          <p className="text-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            © {year} {DATA_CONFIG.club.fullName.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <p className="text-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            SEASON {DATA_CONFIG.club.currentSeason} — ACTIVE
          </p>
        </div>
      </div>
    </footer>
  )
}
