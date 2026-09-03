import { csvToObjects } from '@/lib/csv'
import { debug } from '@/lib/debug'
import { resolveSheetUrl } from '@/lib/sheets'
import { Event, EventStatus, EventType, GameType, LeaderboardEntry } from '@/types'

/**
 * Server-side sheet feeds.
 *
 * The API routes used to own this parsing, which was fine while the client hooks were the
 * only consumers. Event detail pages render on the server and need the same rows, and a
 * page fetching its own /api route would be a server calling itself — so the fetch and the
 * row mapping live here, and the routes are thin wrappers over them.
 *
 * `null` means "not configured" (no sheet URL) and is a normal empty-state path.
 * A fetch or HTTP failure throws, so callers can tell a broken feed from an unset one.
 */

const GAMES: GameType[] = ['FF', 'BGMI', 'Valorant', 'Anime', 'Other']
const EVENT_TYPES: EventType[] = ['tournament', 'workshop', 'screening']

function toGame(value: string | undefined): GameType {
  return GAMES.includes(value as GameType) ? (value as GameType) : 'Other'
}

/** Sheet headers arrive with stray spaces — "event name" and "event_name" must agree. */
function normaliseKeys(row: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
  )
}

async function fetchRows(url: string, label: string): Promise<Record<string, string>[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: 'text/csv' },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

    const rawCsv = await res.text()
    debug.log(`[feeds/${label}] CSV response length:`, rawCsv.length)

    const rows = csvToObjects(rawCsv).map(normaliseKeys)
    debug.log(`[feeds/${label}] Parsed rows count:`, rows.length)
    return rows
  } finally {
    clearTimeout(timeoutId)
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

/**
 * Expected columns (any order):
 * id | event_name | date | description | season | status | event_type | register_url | game_type | recording_url
 */
export function rowToEvent(row: Record<string, string>): Event | null {
  if (!row.id || !row.event_name || !row.date || !row.status) {
    debug.warn('[feeds/events] Skipping invalid row:', row)
    return null
  }

  const rawType = (row.event_type || '').toLowerCase() as EventType

  return {
    id:            row.id,
    event_name:    row.event_name,
    date:          row.date,
    description:   row.description,
    season:        row.season,
    status:        row.status as EventStatus,
    event_type:    EVENT_TYPES.includes(rawType) ? rawType : 'tournament',
    register_url:  row.register_url,
    game_type:     toGame(row.game_type),
    recording_url: row.recording_url && /^https?:\/\//.test(row.recording_url) ? row.recording_url : undefined,
  }
}

export async function fetchEventsFeed(): Promise<Event[] | null> {
  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL)
  if (!url) {
    debug.warn('[feeds/events] No sheet URL configured')
    return null
  }

  const rows = await fetchRows(url, 'events')
  return rows.map(rowToEvent).filter((e): e is Event => e !== null)
}

// ─── Leaderboards ────────────────────────────────────────────────────────────

/**
 * Expected columns (any order):
 * id | event_name | season | rank | player_name | points | game_type | team_name
 */
export function rowToEntry(row: Record<string, string>): LeaderboardEntry | null {
  const rank = parseInt(row.rank, 10)
  const points = parseInt(row.points, 10)

  if (isNaN(rank) || isNaN(points) || !row.id || !row.player_name) {
    debug.warn('[feeds/leaderboards] Skipping invalid row:', row)
    return null
  }

  return {
    id:          row.id,
    event_name:  row.event_name,
    season:      row.season,
    rank,
    player_name: row.player_name,
    points,
    game_type:   toGame(row.game_type),
    team_name:   row.team_name || undefined,
  }
}

export async function fetchLeaderboardsFeed(): Promise<LeaderboardEntry[] | null> {
  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL)
  if (!url) {
    debug.warn('[feeds/leaderboards] No sheet URL configured')
    return null
  }

  const rows = await fetchRows(url, 'leaderboards')
  return rows.map(rowToEntry).filter((e): e is LeaderboardEntry => e !== null)
}
