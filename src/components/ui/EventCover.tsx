import { useId } from 'react'
import { Event, EventType, GameType } from '@/types'
import { GAME_COLORS } from '@/lib/utils'

interface EventCoverProps {
  event: Pick<Event, 'id' | 'event_name' | 'date' | 'game_type' | 'event_type' | 'poster_url'>
  className?: string
  /** Show the giant cropped wordmark. Off where the title already sits beside the cover. */
  wordmark?: boolean
}

/**
 * Cover art for an event. A real poster wins when `poster_url` is set;
 * otherwise the art is generated from the event itself — game colour for the
 * light, event type for the pattern, name and date for the type and the
 * composition — so every event gets its own cover without anyone uploading
 * anything. Deterministic: the same event always draws the same cover.
 *
 * Pure SVG, no motion libraries — stays jsdom-safe like the rest of ui/.
 */
export function EventCover({ event, className = '', wordmark = true }: EventCoverProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  if (event.poster_url) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: 'var(--surface-1)' }}>
        {/* Posters can live on any https host (Supabase Storage, Instagram CDN…),
            so a plain img rather than next/image's allow-listed domains. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.poster_url}
          alt={`${event.event_name} poster`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }

  // 'Other' (workshops, hackathons) takes the club violet — its badge grey reads as dust on a cover
  const color =
    event.game_type === 'Other' ? '#9D4EDD' : GAME_COLORS[event.game_type as GameType] ?? '#9D4EDD'
  const rand = seeded(`${event.id}|${event.event_name}`)

  // Composition — the light pools somewhere different on every cover
  const lightX = 52 + rand() * 36
  const lightY = 18 + rand() * 50
  const tilt = -14 + rand() * 10
  const word = event.event_name.split(/[\s:]+/)[0].toUpperCase()
  const stamp = dateStamp(event.date)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'var(--surface-1)' }}
      role="img"
      aria-label={`${event.event_name} cover art`}
    >
      <svg
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-light`} cx={`${lightX}%`} cy={`${lightY}%`} r="62%">
            <stop offset="0%" stopColor={color} stopOpacity="0.62" />
            <stop offset="45%" stopColor={color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-ambient`} cx={`${100 - lightX}%`} cy="100%" r="70%">
            <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="55%" stopColor="#050408" stopOpacity="0" />
            <stop offset="100%" stopColor="#050408" stopOpacity="0.85" />
          </linearGradient>
          <Pattern id={`${uid}-pattern`} type={event.event_type} color={color} tilt={tilt} />
        </defs>

        <rect width="400" height="225" fill={`url(#${uid}-ambient)`} />
        <rect width="400" height="225" fill={`url(#${uid}-light)`} />
        <rect
          width="400"
          height="225"
          fill={`url(#${uid}-pattern)`}
          opacity="0.9"
        />

        {wordmark && (
          <text
            x="-8"
            y="214"
            fill="none"
            stroke={color}
            strokeWidth="1.4"
            strokeOpacity="0.55"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: '-0.02em',
            }}
          >
            {word}
          </text>
        )}

        <rect width="400" height="225" fill={`url(#${uid}-floor)`} />

        <text
          x="388"
          y="20"
          textAnchor="end"
          fill="#F2EEF8"
          fillOpacity="0.7"
          style={{
            fontFamily: 'var(--font-hud), monospace',
            fontSize: 9,
            letterSpacing: '0.24em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stamp}
        </text>
      </svg>
    </div>
  )
}

/**
 * One pattern per kind of event, so the archive reads at a glance:
 * tournaments slash, workshops grid, screenings run film perforations.
 */
function Pattern({
  id,
  type,
  color,
  tilt,
}: {
  id: string
  type: EventType | string
  color: string
  tilt: number
}) {
  const stroke = { stroke: color, strokeOpacity: 0.22 }
  const patternTransform = `rotate(${tilt})`

  switch (type) {
    case 'workshop':
      return (
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
          <path d="M22 0H0V22" fill="none" strokeWidth="0.6" {...stroke} />
        </pattern>
      )
    case 'screening':
      return (
        <pattern id={id} width="400" height="26" patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
          <rect x="0" y="12" width="400" height="0.6" fill={color} fillOpacity="0.18" />
          <rect x="6" y="4" width="7" height="5" rx="1" fill={color} fillOpacity="0.2" />
        </pattern>
      )
    case 'hackathon':
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
          <circle cx="5" cy="5" r="0.9" fill={color} fillOpacity="0.3" />
        </pattern>
      )
    case 'experience':
      return (
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
          <circle cx="40" cy="40" r="30" fill="none" strokeWidth="0.6" {...stroke} />
          <circle cx="40" cy="40" r="14" fill="none" strokeWidth="0.6" {...stroke} />
        </pattern>
      )
    default:
      // tournament — the .diag slash, repeated
      return (
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
          <path d="M-2 18L18 -2" fill="none" strokeWidth="1" {...stroke} />
        </pattern>
      )
  }
}

/** "2026-07-25" → "25.07.26" */
function dateStamp(date: string): string {
  const [y, m, d] = date.split('-')
  return y && m && d ? `${d}.${m}.${y.slice(2)}` : ''
}

/** Small deterministic PRNG (mulberry32) seeded from a string hash. */
function seeded(key: string): () => number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
