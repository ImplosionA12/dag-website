import { csvToObjects } from '@/lib/csv'
import { debug } from '@/lib/debug'
import { resolveSheetUrl } from '@/lib/sheets'
import { getSupabase, usesSupabase, REVALIDATE_SECONDS, POLLS_REVALIDATE_SECONDS } from '@/lib/supabase'
import { Event, EventStatus, EventType, GameType, HallOfFameEntry, HoFCategory, LeaderboardEntry } from '@/types'
import { Poll, PollStatus, PollType } from '@/types/polls'
import { Member } from '@/types'

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
      next: { revalidate: REVALIDATE_SECONDS },
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

async function fetchEventsFromSupabase(): Promise<Event[]> {
  const { data, error } = await getSupabase()!
    .from('events')
    .select('id, event_name, date, description, season, status, event_type, register_url, game_type, recording_url')
    .order('date', { ascending: false })

  if (error) throw new Error(`[feeds/events] Supabase: ${error.message}`)

  // Reuses rowToEvent so both sources land on identical objects — the column names match the
  // sheet headers on purpose, so validation and defaulting cannot drift between the two.
  return (data ?? [])
    .map(row => rowToEvent(Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v == null ? '' : String(v)])
    )))
    .filter((e): e is Event => e !== null)
}

export async function fetchEventsFeed(): Promise<Event[] | null> {
  if (usesSupabase('events')) return fetchEventsFromSupabase()

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

async function fetchLeaderboardsFromSupabase(): Promise<LeaderboardEntry[]> {
  const { data, error } = await getSupabase()!
    .from('leaderboards')
    .select('id, event_name, season, rank, player_name, points, game_type, team_name')
    .order('season', { ascending: true })
    .order('points', { ascending: false })

  if (error) throw new Error(`[feeds/leaderboards] Supabase: ${error.message}`)

  // rowToEntry parses rank and points from strings because the sheet only ever had strings.
  // Stringifying the integers Postgres returns keeps one validation path for both sources
  // rather than a second one that could accept rows the sheet path would reject.
  return (data ?? [])
    .map(row => rowToEntry(Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v == null ? '' : String(v)])
    )))
    .filter((e): e is LeaderboardEntry => e !== null)
}

export async function fetchLeaderboardsFeed(): Promise<LeaderboardEntry[] | null> {
  if (usesSupabase('leaderboards')) return fetchLeaderboardsFromSupabase()

  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL)
  if (!url) {
    debug.warn('[feeds/leaderboards] No sheet URL configured')
    return null
  }

  const rows = await fetchRows(url, 'leaderboards')
  return rows.map(rowToEntry).filter((e): e is LeaderboardEntry => e !== null)
}

// ─── Hall of Fame ────────────────────────────────────────────────────────────

/**
 * Expected columns (any order):
 * category | player_name | season | description | game_type
 *
 * A row with an empty player_name is "not yet awarded" and is kept deliberately, so all six
 * categories can still be rendered as placeholders rather than vanishing from the board.
 */
export function rowToHofEntry(row: Record<string, string>): HallOfFameEntry | null {
  if (!row.category) {
    debug.warn('[feeds/hall-of-fame] Skipping row with missing category:', row)
    return null
  }

  return {
    category:    row.category as HoFCategory,
    player_name: row.player_name,
    season:      row.season,
    description: row.description,
    game_type:   toGame(row.game_type),
  }
}

async function fetchHallOfFameFromSupabase(): Promise<HallOfFameEntry[]> {
  const { data, error } = await getSupabase()!
    .from('hall_of_fame')
    .select('category, player_name, season, description, game_type')
    .order('season', { ascending: false })

  if (error) throw new Error(`[feeds/hall-of-fame] Supabase: ${error.message}`)

  return (data ?? [])
    .map(row => rowToHofEntry(Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v == null ? '' : String(v)])
    )))
    .filter((e): e is HallOfFameEntry => e !== null)
}

export async function fetchHallOfFameFeed(): Promise<HallOfFameEntry[] | null> {
  if (usesSupabase('hall_of_fame')) return fetchHallOfFameFromSupabase()

  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_HOF_URL)
  if (!url) {
    debug.warn('[feeds/hall-of-fame] No sheet URL configured')
    return null
  }

  const rows = await fetchRows(url, 'hall-of-fame')
  return rows.map(rowToHofEntry).filter((e): e is HallOfFameEntry => e !== null)
}

// ─── Polls ───────────────────────────────────────────────────────────────────

/**
 * Polls are the one feed with no sheet behind it — the route has always served hardcoded
 * mock data, because a CSV export cannot accept a vote. Supabase is what makes the real
 * thing possible, so this reads options and tallies from the database.
 *
 * Counts come from the poll_results view rather than the vote rows: individual votes are not
 * readable (voter_key is not granted to any role), and counting in Postgres avoids shipping
 * one row per vote to the app just to length-check it.
 */
async function fetchPollsFromSupabase(): Promise<Poll[]> {
  const supabase = getSupabase(POLLS_REVALIDATE_SECONDS)!

  const [pollsRes, resultsRes] = await Promise.all([
    supabase
      .from('polls')
      .select('id, type, title, description, season, status, ends_at, form_url')
      .order('created_at', { ascending: true }),
    supabase
      .from('poll_results')
      .select('poll_id, option_id, label, position, votes'),
  ])

  if (pollsRes.error) throw new Error(`[feeds/polls] Supabase: ${pollsRes.error.message}`)
  if (resultsRes.error) throw new Error(`[feeds/polls] Supabase: ${resultsRes.error.message}`)

  const results = resultsRes.data ?? []

  return (pollsRes.data ?? []).map(poll => {
    const rows = results
      .filter(r => r.poll_id === poll.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    const votes = rows.map(r => Number(r.votes) || 0)
    const total = votes.reduce((sum, v) => sum + v, 0)

    return {
      id:      poll.id,
      type:    poll.type as PollType,
      title:   poll.title,
      description: poll.description ?? undefined,
      season:  poll.season,
      status:  poll.status as PollStatus,
      ends_at: poll.ends_at ?? undefined,
      form_url: poll.form_url ?? undefined,
      // A poll with no votes yet gets zeroes rather than a division by zero.
      options: rows.map((r, i) => ({
        id:    r.option_id,
        label: r.label,
        votes: votes[i],
        percentage: total > 0 ? Math.round((votes[i] / total) * 100) : 0,
      })),
      // Every voter casts one vote per poll (unique on poll_id + voter_key), so the vote
      // total and the voter count are the same number.
      total_voters: total,
    } satisfies Poll
  })
}

/** Null means "not on Supabase" — the route then falls back to its mock polls as before. */
export async function fetchPollsFeed(): Promise<Poll[] | null> {
  if (!usesSupabase('polls')) return null
  return fetchPollsFromSupabase()
}

// ─── Members ─────────────────────────────────────────────────────────────────

/**
 * The roster lives in the database, not in the repo.
 *
 * It used to be a hardcoded array, which meant every committee change was a code edit and a
 * deploy — for data that turns over every year and that no developer should be a bottleneck
 * for. There is no sheet behind it and never was, so there is no feed switch either:
 * Supabase is the only source, and an unconfigured site renders an empty roster rather than
 * a stale one baked in at build time.
 */
export async function fetchMembersFeed(): Promise<Member[] | null> {
  const supabase = getSupabase()
  if (!supabase) {
    debug.warn('[feeds/members] Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('members')
    .select('name, role, games, is_founder, is_president, note, instagram, discord, position')
    .order('position', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(`[feeds/members] Supabase: ${error.message}`)

  return (data ?? []).map(row => ({
    name:        row.name,
    role:        row.role,
    games:       (row.games ?? []).filter((g: string) => GAMES.includes(g as GameType)) as GameType[],
    isFounder:   Boolean(row.is_founder),
    isPresident: Boolean(row.is_president),
    note:        row.note ?? undefined,
    // Omitted entirely when neither handle is set, so the card does not render an empty
    // socials row for a member who has none.
    socials:
      row.instagram || row.discord
        ? { instagram: row.instagram ?? undefined, discord: row.discord ?? undefined }
        : undefined,
  }))
}
