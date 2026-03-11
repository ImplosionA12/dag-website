import { NextResponse } from 'next/server'
import { csvToObjects } from '@/lib/csv'
import { LeaderboardsResponse, LeaderboardEntry, GameType } from '@/types'

/**
 * Expected Google Sheet columns (exact header names, in any order):
 * id | event_name | season | rank | player_name | points | game_type | team_name
 */
function rowToEntry(row: Record<string, string>): LeaderboardEntry {
  return {
    id:          row.id,
    event_name:  row.event_name,
    season:      row.season,
    rank:        parseInt(row.rank, 10),
    player_name: row.player_name,
    points:      parseInt(row.points, 10),
    game_type:   (['FF', 'BGMI', 'Valorant', 'Anime', 'Other'] as GameType[]).includes(row.game_type as GameType)
                   ? (row.game_type as GameType)
                   : 'Other',
    team_name:   row.team_name || undefined,
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL

  console.log('[api/leaderboards] NEXT_PUBLIC_SHEETS_LEADERBOARDS_URL =', url ?? '(not set)')

  if (!url) {
    console.warn('[api/leaderboards] No sheet URL configured — returning empty leaderboards')
    return NextResponse.json({ leaderboards: [] } satisfies LeaderboardsResponse)
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 }, headers: { Accept: 'text/csv' } })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

    const rawCsv = await res.text()
    console.log('[api/leaderboards] Raw CSV (first 500 chars):\n', rawCsv.slice(0, 500))

    // Normalize keys: trim whitespace and replace spaces with underscores
    // so "player name" → "player_name", "event name" → "event_name", etc.
    const rawRows = csvToObjects(rawCsv)
    const rows = rawRows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
      )
    )

    console.log('[api/leaderboards] Parsed rows count:', rows.length)
    if (rows.length > 0) console.log('[api/leaderboards] First row keys:', Object.keys(rows[0]))
    if (rows.length > 0) console.log('[api/leaderboards] First row values:', rows[0])

    const leaderboards: LeaderboardEntry[] = rows
      .filter(r => r.id && r.player_name)
      .map(rowToEntry)

    console.log('[api/leaderboards] Entries returned:', leaderboards.length)
    return NextResponse.json({ leaderboards } satisfies LeaderboardsResponse)
  } catch (err) {
    console.error('[api/leaderboards] Fetch/parse failed:', err)
    return NextResponse.json({ leaderboards: [] } satisfies LeaderboardsResponse)
  }
}
