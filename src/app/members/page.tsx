import type { Metadata } from 'next'
import { RosterGrid } from '@/components/sections/members/RosterGrid'
import { ZoneHero } from '@/components/ui/ZoneHero'
import { fetchMembersFeed } from '@/lib/feeds'

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

/** Matches the other feeds, so a roster edit is live within a minute. */
export const revalidate = 60

export default async function MembersPage() {
  // An unavailable roster shows the standby empty state rather than failing the page — the
  // rest of the zone (hero, copy) is still worth rendering.
  const members = await fetchMembersFeed().catch(() => null)

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
      <RosterGrid members={members ?? []} />
    </div>
  )
}
