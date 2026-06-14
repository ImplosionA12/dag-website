import type { Metadata } from 'next'
import { BroadcastStandings } from '@/components/sections/leaderboards/BroadcastStandings'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'Leaderboards — The Scoreboard Hall',
  description: 'DAG tournament leaderboards. Season rankings, points, and player stats.',
  alternates: { canonical: '/leaderboards' },
  openGraph: {
    title: 'DAG Leaderboards — The Scoreboard Hall',
    description: 'Season rankings, points, and player stats for every DAG tournament.',
    url: '/leaderboards',
  },
  twitter: {
    title: 'DAG Leaderboards — The Scoreboard Hall',
    description: 'Season rankings, points, and player stats.',
  },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export default function LeaderboardsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DAG Leaderboards',
            description: 'Tournament rankings, points, and player stats.',
            url: `${SITE_URL}/leaderboards`,
            isPartOf: { '@type': 'WebSite', name: 'DAG', url: SITE_URL },
          }),
        }}
      />
      <div
        data-zone="leaderboards"
        className="pt-page-top"
        style={{
          background: `
            radial-gradient(ellipse 60% 30% at 50% 0%, rgba(79,195,247,0.05) 0%, transparent 60%),
            var(--void)
          `,
          minHeight: '100vh',
        }}
      >
        <ZoneHero
          eyebrow="THE SCOREBOARD HALL"
          lines={['THE', 'STANDINGS']}
          outlineLines={[1]}
          copy="Every point tracked. Every position earned. The board doesn't lie."
        />
        <BroadcastStandings />
      </div>
    </>
  )
}
