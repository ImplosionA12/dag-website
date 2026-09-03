import { NextResponse } from 'next/server'
import { LeaderboardsResponse } from '@/types'
import { debug } from '@/lib/debug'
import { fetchLeaderboardsFeed } from '@/lib/feeds'

export async function GET() {
  try {
    const leaderboards = await fetchLeaderboardsFeed()

    if (leaderboards === null) {
      debug.warn('[api/leaderboards] No sheet URL configured — returning empty leaderboards')
      return NextResponse.json({ leaderboards: [] } satisfies LeaderboardsResponse)
    }

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
