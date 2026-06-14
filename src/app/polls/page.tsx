import type { Metadata } from 'next'
import { LiveVoteHud } from '@/components/sections/polls/LiveVoteHud'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'Polls — The Vote',
  description: 'Vote on active community polls. Your voice shapes the arena.',
  alternates: { canonical: '/polls' },
  openGraph: {
    title: 'DAG Polls — The Vote',
    description: 'Vote on active community polls. Your voice shapes the arena.',
    url: '/polls',
  },
  twitter: {
    title: 'DAG Polls — The Vote',
    description: 'Vote on active community polls.',
  },
}

export default function PollsPage() {
  return (
    <div
      data-zone="polls"
      className="pt-page-top"
      style={{
        background: `
          radial-gradient(ellipse 70% 35% at 50% 0%, rgba(123,47,190,0.07) 0%, transparent 60%),
          var(--void)
        `,
        minHeight: '100vh',
      }}
    >
      <ZoneHero
        eyebrow="THE VOTE"
        lines={['LIVE', 'BALLOTS']}
        outlineLines={[1]}
        copy="The club decides together. Bars move in real time as votes land."
      />
      <LiveVoteHud />
    </div>
  )
}
