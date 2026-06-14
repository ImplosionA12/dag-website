import { NextResponse } from 'next/server'
import { csvToObjects } from '@/lib/csv'
import { LeaderboardsResponse, LeaderboardEntry, GameType } from '@/types'
import { debug } from '@/lib/debug'

/**
 * Expected Google Sheet columns (exact header names, in any order):
 * id | event_name | season | rank | player_name | points | game_type | team_name
 */
function rowToEntry(row: Record<string, string>): LeaderboardEntry | null {
  const rank = parseInt(row.rank, 10)
  const points = parseInt(row.points, 10)

  if (isNaN(rank) || isNaN(points) || !row.id || !row.player_name) {
    debug.warn('[api/leaderboards] Skipping invalid row:', row)
    return null
  }

  return {
    id:          row.id,
    event_name:  row.event_name,
    season:      row.season,
    rank,
    player_name: row.player_name,
    points,
    game_type:   (['FF', 'BGMI', 'Valorant', 'Anime', 'Other'] as GameType[]).includes(row.game_type as GameType)
                   ? (row.game_type as GameType)
                   : 'Other',
    team_name:   row.team_name || undefined,
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL

  debug.log('[api/leaderboards] Sheet URL configured:', !!url)

  if (!url) {
    debug.warn('[api/leaderboards] No sheet URL configured — returning empty leaderboards')
    return NextResponse.json({ leaderboards: [] } satisfies LeaderboardsResponse)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, { next: { revalidate: 60 }, headers: { Accept: 'text/csv' }, signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

    const rawCsv = await res.text()
    debug.log('[api/leaderboards] CSV response length:', rawCsv.length)

    const rawRows = csvToObjects(rawCsv)
    const rows = rawRows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
      )
    )

    debug.log('[api/leaderboards] Parsed rows count:', rows.length)
    if (rows.length > 0) debug.log('[api/leaderboards] First row keys:', Object.keys(rows[0]))

    const leaderboards: LeaderboardEntry[] = rows
      .map(rowToEntry)
      .filter((entry): entry is LeaderboardEntry => entry !== null)

    debug.log('[api/leaderboards] Entries returned:', leaderboards.length)
    return NextResponse.json({ leaderboards } satisfies LeaderboardsResponse)
  } catch (err) {
    console.error('[api/leaderboards] Fetch/parse failed:', err)
    return NextResponse.json(
      { leaderboards: [], error: 'Failed to fetch leaderboards' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
