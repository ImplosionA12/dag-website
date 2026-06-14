import type { Metadata } from 'next'
import { MissionSelect } from '@/components/sections/events/MissionSelect'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'Events — The Battleground',
  description:
    'Upcoming and past DAG tournaments. Register for open battles, view results for completed events.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'DAG Events — The Battleground',
    description:
      'Upcoming and past DAG tournaments. Register for open battles, view results for completed events.',
    url: '/events',
  },
  twitter: {
    title: 'DAG Events — The Battleground',
    description: 'Upcoming and past DAG tournaments. Register for open battles.',
  },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DAG Events',
            description: 'Upcoming and past DAG tournaments.',
            url: `${SITE_URL}/events`,
            isPartOf: { '@type': 'WebSite', name: 'DAG', url: SITE_URL },
          }),
        }}
      />
      <div
        data-zone="events"
        className="pt-page-top"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(123,47,190,0.08) 0%, transparent 60%),
            var(--void)
          `,
          minHeight: '100vh',
        }}
      >
        <ZoneHero
          eyebrow="THE BATTLEGROUND"
          lines={['MISSION', 'SELECT']}
          outlineLines={[1]}
          copy="Every tournament, scrim, and screening on one board. Pick your battle."
        />
        <MissionSelect />
      </div>
    </>
  )
}
