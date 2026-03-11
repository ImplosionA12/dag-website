import { NextResponse } from 'next/server'
import { EventsResponse, Event, GameType, EventStatus, EventType } from '@/types'

/**
 * Expected Google Sheet columns (exact header names, in any order):
 * id | event_name | date | description | season | status | event_type | register_url | game_type | recording_url
 *
 * event_type values: tournament | workshop | screening
 * recording_url: leave blank for tournaments; YouTube/Drive URL for workshops/screenings
 */
function rowToEvent(row: Record<string, string>): Event {
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
    recording_url: row.recording_url || undefined,
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SHEETS_EVENTS_URL

  console.log('[api/events] NEXT_PUBLIC_SHEETS_EVENTS_URL =', url ?? '(not set)')

  if (!url) {
    console.warn('[api/events] No sheet URL configured — returning empty events')
    return NextResponse.json({ events: [] } satisfies EventsResponse)
  }

  try {
    const rawCsv = await (async () => {
      const res = await fetch(url, { next: { revalidate: 60 }, headers: { Accept: 'text/csv' } })
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      return res.text()
    })()

    console.log('[api/events] Raw CSV response (first 500 chars):\n', rawCsv.slice(0, 500))

    // Re-use csvToObjects from lib
    const { csvToObjects } = await import('@/lib/csv')
    const rawRows = csvToObjects(rawCsv)
    const rows = rawRows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.trim().replace(/\s+/g, '_'), v])
      )
    )

    console.log('[api/events] Parsed rows count:', rows.length)
    if (rows.length > 0) console.log('[api/events] First row keys:', Object.keys(rows[0]))

    const events: Event[] = rows
      .filter(r => r.id && r.event_name)
      .map(rowToEvent)

    console.log('[api/events] Events returned:', events.length)
    return NextResponse.json({ events } satisfies EventsResponse)
  } catch (err) {
    console.error('[api/events] Fetch/parse failed:', err)
    return NextResponse.json({ events: [] } satisfies EventsResponse)
  }
}
