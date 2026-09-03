import { NextResponse } from 'next/server'
import { csvToObjects } from '@/lib/csv'
import { HallOfFameResponse, HallOfFameEntry, HoFCategory, GameType } from '@/types'
import { debug } from '@/lib/debug'
import { resolveSheetUrl } from '@/lib/sheets'

/**
 * Expected Google Sheet columns (exact header names, in any order):
 * category | player_name | season | description | game_type
 *
 * Rows with an empty player_name are treated as "not yet awarded" and
 * are still included so all 6 categories always appear.
 */
function rowToEntry(row: Record<string, string>): HallOfFameEntry | null {
  if (!row.category) {
    debug.warn('[api/hall-of-fame] Skipping row with missing category:', row)
    return null
  }

  return {
    category:    row.category as HoFCategory,
    player_name: row.player_name,
    season:      row.season,
    description: row.description,
    game_type:   (['FF', 'BGMI', 'Valorant', 'Anime', 'Other'] as GameType[]).includes(row.game_type as GameType)
                   ? (row.game_type as GameType)
                   : 'Other',
  }
}

export async function GET() {
  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_HOF_URL)

  debug.log('[api/hall-of-fame] Sheet URL configured:', !!url)

  if (!url) {
    debug.warn('[api/hall-of-fame] No sheet URL configured — returning empty')
    return NextResponse.json({ hall_of_fame: [] } satisfies HallOfFameResponse)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, { next: { revalidate: 60 }, headers: { Accept: 'text/csv' }, signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

    const rawCsv = await res.text()
    debug.log('[api/hall-of-fame] CSV response length:', rawCsv.length)

    const rawRows = csvToObjects(rawCsv)
    const rows = rawRows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
      )
    )

    const hall_of_fame: HallOfFameEntry[] = rows
      .map(rowToEntry)
      .filter((entry): entry is HallOfFameEntry => entry !== null)

    debug.log('[api/hall-of-fame] Entries returned:', hall_of_fame.length)
    return NextResponse.json({ hall_of_fame } satisfies HallOfFameResponse)
  } catch (err) {
    console.error('[api/hall-of-fame] Fetch/parse failed:', err)
    return NextResponse.json(
      { hall_of_fame: [], error: 'Failed to fetch hall of fame' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
