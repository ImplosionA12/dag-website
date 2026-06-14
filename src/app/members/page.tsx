import type { Metadata } from 'next'
import { RosterGrid } from '@/components/sections/members/RosterGrid'
import { ZoneHero } from '@/components/ui/ZoneHero'

export const metadata: Metadata = {
  title: 'Members — The Roster',
  description: 'Meet the DAG roster. Founders, core team, competitive players, and animators.',
  alternates: { canonical: '/members' },
  openGraph: {
    title: 'DAG Members — The Roster',
    description: 'Meet the DAG roster. Founders, core team, competitive players, and animators.',
    url: '/members',
  },
  twitter: {
    title: 'DAG Members — The Roster',
    description: 'Meet the DAG roster. Founders, core team.',
  },
}

export default function MembersPage() {
  return (
    <div
      data-zone="members"
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
        eyebrow="THE ROSTER"
        lines={['SELECT YOUR', 'OPERATOR']}
        outlineLines={[1]}
        copy="The core team running the arena — players, creators, and the people behind both wings."
      />
      <RosterGrid />
    </div>
  )
}
