import { NextResponse } from 'next/server'
import { EventsResponse, Event, GameType, EventStatus, EventType } from '@/types'
import { debug } from '@/lib/debug'
import { resolveSheetUrl } from '@/lib/sheets'

/**
 * Expected Google Sheet columns (exact header names, in any order):
 * id | event_name | date | description | season | status | event_type | register_url | game_type | recording_url
 *
 * event_type values: tournament | workshop | screening
 * recording_url: leave blank for tournaments; YouTube/Drive URL for workshops/screenings
 */
function rowToEvent(row: Record<string, string>): Event | null {
  if (!row.id || !row.event_name || !row.date || !row.status) {
    debug.warn('[api/events] Skipping invalid row:', row)
    return null
  }

  const rawType = (row.event_type || '').toLowerCase() as EventType
  return {
    id:           row.id,
    event_name:   row.event_name,
    date:         row.date,
    description:  row.description,
    season:       row.season,
    status:       row.status as EventStatus,
    event_type:   (['tournament', 'workshop', 'screening'] as EventType[]).includes(rawType)
                    ? rawType
                    : 'tournament',
    register_url:  row.register_url,
    game_type:     (['FF', 'BGMI', 'Valorant', 'Anime', 'Other'] as GameType[]).includes(row.game_type as GameType)
                    ? (row.game_type as GameType)
                    : 'Other',
    recording_url: row.recording_url && /^https?:\/\//.test(row.recording_url) ? row.recording_url : undefined,
  }
}

export async function GET() {
  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL)

  debug.log('[api/events] Sheet URL configured:', !!url)

  if (!url) {
    debug.warn('[api/events] No sheet URL configured — returning empty events')
    return NextResponse.json({ events: [] } satisfies EventsResponse)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const rawCsv = await (async () => {
      const res = await fetch(url, { next: { revalidate: 60 }, headers: { Accept: 'text/csv' }, signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      return res.text()
    })()

    debug.log('[api/events] CSV response length:', rawCsv.length)

    const { csvToObjects } = await import('@/lib/csv')
    const rawRows = csvToObjects(rawCsv)
    const rows = rawRows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
      )
    )

    debug.log('[api/events] Parsed rows count:', rows.length)
    if (rows.length > 0) debug.log('[api/events] First row keys:', Object.keys(rows[0]))

    const events: Event[] = rows
      .map(rowToEvent)
      .filter((event): event is Event => event !== null)

    debug.log('[api/events] Events returned:', events.length)
    return NextResponse.json({ events } satisfies EventsResponse)
  } catch (err) {
    console.error('[api/events] Fetch/parse failed:', err)
    return NextResponse.json(
      { events: [], error: 'Failed to fetch events' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
