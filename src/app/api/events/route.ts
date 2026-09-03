import { NextResponse } from 'next/server'
import { EventsResponse } from '@/types'
import { debug } from '@/lib/debug'
import { fetchEventsFeed } from '@/lib/feeds'

export async function GET() {
  try {
    const events = await fetchEventsFeed()

    if (events === null) {
      debug.warn('[api/events] No sheet URL configured — returning empty events')
      return NextResponse.json({ events: [] } satisfies EventsResponse)
    }

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
