import type { Metadata } from 'next'
import { Manifesto } from '@/components/sections/about/Manifesto'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'About — The Lore',
  description: 'The origin story of DAG — Drushya Animations & Gaming.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About DAG — The Lore',
    description: 'The origin story of DAG — Drushya Animations & Gaming.',
    url: '/about',
  },
  twitter: {
    title: 'About DAG — The Lore',
    description: 'The origin story of DAG — Drushya Animations & Gaming.',
  },
}

export default function AboutPage() {
  return (
    <div
      data-zone="about"
      className="pt-page-top"
      style={{
        background: `
          radial-gradient(ellipse 70% 35% at 50% 0%, rgba(123,47,190,0.06) 0%, transparent 60%),
          var(--void)
        `,
        minHeight: '100vh',
      }}
    >
      <ZoneHero
        eyebrow="THE LORE"
        lines={['THE DAG', 'STORY']}
        outlineLines={[1]}
        copy="Where gaming meets animation — and why we built an arena for both."
      />
      <Manifesto />
    </div>
  )
}
