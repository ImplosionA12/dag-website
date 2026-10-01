import { useId } from 'react'
import { GameType } from '@/types'
import { GAME_COLORS } from '@/lib/utils'

interface MemberPortraitProps {
  name: string
  games: GameType[]
  photoUrl?: string
  className?: string
}

/**
 * Member portrait. A real photo wins when `photoUrl` is set; otherwise a
 * generated character-select tile: the member's main game lights it, the
 * initials stand in for a face. Pure SVG — jsdom-safe like the rest of ui/.
 */
export function MemberPortrait({ name, games, photoUrl, className = '' }: MemberPortraitProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  if (photoUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: 'var(--surface-2)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  // Crew with no game (or 'Other') take the club violet — the badge grey reads as dust here
  const lit = games.filter(g => g !== 'Other')
  const color = lit[0] ? GAME_COLORS[lit[0]] : '#9D4EDD'
  const second = lit[1] ? GAME_COLORS[lit[1]] : '#7B2FBE'
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'var(--surface-2)' }}
      role="img"
      aria-label={`${name} portrait`}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-key`} cx="72%" cy="22%" r="75%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-rim`} cx="10%" cy="100%" r="65%">
            <stop offset="0%" stopColor={second} stopOpacity="0.35" />
            <stop offset="100%" stopColor={second} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${uid}-scan`} width="400" height="4" patternUnits="userSpaceOnUse">
            <rect width="400" height="1" fill="#F2EEF8" fillOpacity="0.035" />
          </pattern>
          <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="60%" stopColor="#050408" stopOpacity="0" />
            <stop offset="100%" stopColor="#050408" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect width="400" height="300" fill={`url(#${uid}-rim)`} />
        <rect width="400" height="300" fill={`url(#${uid}-key)`} />

        {/* Head-and-shoulders silhouette, so the tile reads as a person */}
        <g fill="#050408" fillOpacity="0.55">
          <circle cx="200" cy="138" r="54" />
          <path d="M84 300c8-62 56-98 116-98s108 36 116 98z" />
        </g>
        <g fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="1.2">
          <circle cx="200" cy="138" r="54" />
          <path d="M84 300c8-62 56-98 116-98s108 36 116 98" />
        </g>

        <rect width="400" height="300" fill={`url(#${uid}-scan)`} />
        <rect width="400" height="300" fill={`url(#${uid}-floor)`} />

        <text
          x="22"
          y="282"
          fill="#F2EEF8"
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: '0.01em',
          }}
        >
          {initials}
        </text>
      </svg>
    </div>
  )
}
