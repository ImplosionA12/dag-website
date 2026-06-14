import type { Metadata } from 'next'
import { TrophyHall } from '@/components/sections/hall-of-fame/TrophyHall'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'Hall of Fame — The Shrine',
  description: 'DAG Hall of Fame. Season champions, iron players, and legends.',
  alternates: { canonical: '/hall-of-fame' },
  openGraph: {
    title: 'DAG Hall of Fame — The Shrine',
    description: 'Season champions, iron players, and legends of the arena.',
    url: '/hall-of-fame',
  },
  twitter: {
    title: 'DAG Hall of Fame — The Shrine',
    description: 'Season champions, iron players, and legends.',
  },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export default function HallOfFamePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DAG Hall of Fame',
            description: 'Season champions, iron players, and legends.',
            url: `${SITE_URL}/hall-of-fame`,
            isPartOf: { '@type': 'WebSite', name: 'DAG', url: SITE_URL },
          }),
        }}
      />
      <div
        data-zone="hof"
        className="pt-page-top"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,183,3,0.07) 0%, transparent 60%),
            var(--void)
          `,
          minHeight: '100vh',
        }}
      >
        <ZoneHero
          eyebrow="THE SHRINE"
          lines={['HALL OF', 'FAME']}
          outlineLines={[1]}
          copy="Six trophies. One season. The names that defined the arena live here forever."
        />
        <TrophyHall />
      </div>
    </>
  )
}
