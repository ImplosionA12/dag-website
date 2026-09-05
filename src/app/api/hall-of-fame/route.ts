import { NextResponse } from 'next/server'
import { HallOfFameResponse } from '@/types'
import { debug } from '@/lib/debug'
import { fetchHallOfFameFeed } from '@/lib/feeds'

/**
 * These routes render statically, so without an explicit window they are generated once at
 * build and never again. The Supabase client and fetchRows set the same value on their own
 * requests; stating it here too means a route stays fresh regardless of which source it reads.
 */
export const revalidate = 60

export async function GET() {
  try {
    const hall_of_fame = await fetchHallOfFameFeed()

    if (hall_of_fame === null) {
      debug.warn('[api/hall-of-fame] No sheet URL configured — returning empty')
      return NextResponse.json({ hall_of_fame: [] } satisfies HallOfFameResponse)
    }

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
