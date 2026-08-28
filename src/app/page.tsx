import type { Metadata } from 'next'
import { HomeHero } from '@/components/sections/home/HomeHero'
import { NextEventSpotlight } from '@/components/sections/home/NextEventSpotlight'
import { TwoWings } from '@/components/sections/home/TwoWings'
import { SeasonStats } from '@/components/sections/home/SeasonStats'
import { JoinCTA } from '@/components/sections/home/JoinCTA'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'
import { AmbientField } from '@/components/cinematic/AmbientField'

export const metadata: Metadata = {
  title: 'DAG — Enter the Arena',
  description:
    'DAG — Drushya Animations & Gaming. Where Gaming Meets Animation. Season 1 is active.',
}

export default function HomePage() {
  return (
    <div data-zone="home">
      {/* One light source for the whole zone — sections sit inside it */}
      <AmbientField />

      {/* Scene 1 — Title screen */}
      <HomeHero />

      {/* Scene 2 — Up next: broadcast spotlight */}
      <NextEventSpotlight />

      {/* Interstitial — broadcast marquee */}
      <MarqueeStrip
        items={['TOURNAMENTS', 'SCREENINGS', 'STANDINGS', 'TROPHIES', 'SCRIMS', 'PREMIERES']}
      />

      {/* Scene 3 — The two wings */}
      <TwoWings />

      {/* Scene 4 — Season telemetry */}
      <SeasonStats />

      {/* Scene 5 — Gold close */}
      <JoinCTA />
    </div>
  )
}
