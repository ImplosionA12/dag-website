import { Event, GameType } from '@/types'

// ─── Date Utilities ──────────────────────────────────────────────────────────

/**
 * Returns the number of days remaining until a date string (YYYY-MM-DD).
 * Returns null if the date is in the past.
 */
export function daysRemaining(dateString: string): number | null {
  const target = new Date(dateString)
  const now = new Date()
  // Compare date-only (strip time)
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
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
