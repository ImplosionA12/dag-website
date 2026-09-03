import { NextResponse } from 'next/server'
import { Poll, PollsResponse } from '@/types/polls'
import { resolveSheetUrl } from '@/lib/sheets'

const MOCK_POLLS: Poll[] = [
  {
    id: 'best-game-s1',
    type: 'general',
    title: 'Best Game of Season 1?',
    description: 'Which game defined your Season 1 experience?',
    season: 'S1',
    status: 'open',
    total_voters: 47,
    ends_at: '2026-04-01',
    form_url: '#',
    options: [
      { id: 'free-fire',  label: 'Free Fire',  votes: 18, percentage: 38 },
      { id: 'bgmi',       label: 'BGMI',        votes: 15, percentage: 32 },
      { id: 'valorant',   label: 'Valorant',    votes: 10, percentage: 21 },
      { id: 'other',      label: 'Other',       votes: 4,  percentage: 9  },
    ],
  },
  {
    id: 'next-workshop',
    type: 'animation',
    title: 'Next Workshop Topic?',
    description: 'Vote for the topic you want covered in the next club workshop.',
    season: 'S1',
    status: 'open',
    total_voters: 31,
    ends_at: '2026-03-28',
    form_url: '#',
    options: [
      { id: 'video-editing',    label: 'Video Editing',    votes: 12, percentage: 39 },
      { id: '3d-modeling',      label: '3D Modeling',      votes: 9,  percentage: 29 },
      { id: 'motion-graphics',  label: 'Motion Graphics',  votes: 7,  percentage: 23 },
      { id: 'game-design',      label: 'Game Design',      votes: 3,  percentage: 10 },
    ],
  },
  {
    id: 'tournament-format',
    type: 'event',
    title: 'Preferred Tournament Format?',
    description: 'How should we structure future tournaments?',
    season: 'S1',
    status: 'closed',
    total_voters: 62,
    form_url: undefined,
    options: [
      { id: 'solo',   label: 'Solo',   votes: 14, percentage: 23 },
      { id: 'duo',    label: 'Duo',    votes: 22, percentage: 35 },
      { id: 'squad',  label: 'Squad',  votes: 19, percentage: 31 },
      { id: 'mixed',  label: 'Mixed',  votes: 7,  percentage: 11 },
    ],
  },
]

export async function GET() {
  const url = resolveSheetUrl(process.env.NEXT_PUBLIC_SHEETS_POLLS_URL)

  if (!url) {
    return NextResponse.json({ polls: MOCK_POLLS } satisfies PollsResponse)
  }

  try {
    const res = await fetch(url, { next: { revalidate: 30 } })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    const json = await res.json()
    const polls: Poll[] = json.polls ?? []
    return NextResponse.json({ polls } satisfies PollsResponse)
  } catch (err) {
    console.error('[api/polls] Fetch failed:', err)
    return NextResponse.json({ polls: MOCK_POLLS } satisfies PollsResponse)
  }
}
