import { Event, GameType, LeaderboardEntry } from '@/types'
import { DATA_CONFIG } from '@/config/data'

// ─── Date Utilities ──────────────────────────────────────────────────────────

/**
 * Returns the number of days remaining until a date string (YYYY-MM-DD).
 * Returns null if the date is in the past.
 */
export function daysRemaining(dateString: string): number | null {
  // Parse YYYY-MM-DD directly to avoid UTC vs local timezone shift
  const [y, m, d] = dateString.split('-').map(Number)
  const targetDay = new Date(y, m - 1, d)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.ceil((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff : null
}

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable format.
 * e.g. "15 AUG 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace(/ /g, ' ')
}

/**
 * Returns true if a date string is in the future.
 */
export function isFutureDate(dateString: string): boolean {
  return daysRemaining(dateString) !== null
}

// ─── Event Utilities ─────────────────────────────────────────────────────────

/**
 * Finds the next upcoming open event from a list.
 * Returns the event with the earliest future date and status 'open'.
 */
export function getNextEvent(events: Event[]): Event | null {
  const upcoming = events
    .filter(e => e.status === 'open' && isFutureDate(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] ?? null
}

/**
 * Splits events into upcoming and past.
 */
export function splitEvents(events: Event[]): { upcoming: Event[]; past: Event[] } {
  const upcoming = events
    .filter(e => e.status !== 'completed' && isFutureDate(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const past = events
    .filter(e => e.status === 'completed' || !isFutureDate(e.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return { upcoming, past }
}

/**
 * URL slug for an event — "Wipe Out Arena: Reloaded" -> "wipe-out-arena-reloaded".
 *
 * Sheet ids are bare row numbers ("1".."10"), which make for opaque, unstable URLs:
 * reordering the sheet would silently repoint every shared link. Slugs are derived from
 * the name instead, so a detail URL reads as the event it shows.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function eventSlug(event: Event): string {
  return slugify(event.event_name) || event.id
}

/**
 * Resolves a URL segment to an event. Matches the slug first, then the raw sheet id, so
 * links shared before slugs existed still land.
 */
export function findEventBySlug(events: Event[], slug: string): Event | null {
  const wanted = slug.toLowerCase()
  return (
    events.find(e => eventSlug(e) === wanted) ??
    events.find(e => e.id.toLowerCase() === wanted) ??
    null
  )
}

/** Standings rows for one event, best first. Matched on name — the sheet has no event id. */
export function standingsForEvent(
  entries: LeaderboardEntry[],
  event: Event
): LeaderboardEntry[] {
  const name = event.event_name.trim().toLowerCase()
  return entries
    .filter(e => (e.event_name || '').trim().toLowerCase() === name)
    .sort((a, b) => a.rank - b.rank)
}

// ─── Game Type Utilities ─────────────────────────────────────────────────────

export const GAME_COLORS: Record<GameType, string> = {
  FF:       '#FF4500',
  BGMI:     '#4FC3F7',
  Valorant: '#FF4655',
  Anime:    '#E040FB',
  Other:    '#9B8FA8',
}

export const GAME_LABELS: Record<GameType, string> = {
  FF:       'Free Fire',
  BGMI:     'BGMI',
  Valorant: 'Valorant',
  Anime:    'Anime',
  Other:    'Other',
}

// ─── Rank Utilities ──────────────────────────────────────────────────────────

export function getRankColor(rank: number): string {
  if (rank === 1) return '#FFB703'
  if (rank === 2) return '#C0C0C0'
  if (rank === 3) return '#CD7F32'
  return '#9B8FA8'
}

export function getRankLabel(rank: number): string {
  if (rank === 1) return '1st'
  if (rank === 2) return '2nd'
  if (rank === 3) return '3rd'
  return `${rank}th`
}

// ─── String Utilities ────────────────────────────────────────────────────────

export function clsx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * "S2" → "02" — the zero-padded form used in HUD readouts.
 * Defaults to the current season so a season rollover only needs DATA_CONFIG.
 */
export function seasonTag(season: string = DATA_CONFIG.club.currentSeason): string {
  return season.replace('S', '0')
}
