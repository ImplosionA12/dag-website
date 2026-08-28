'use client'

import { useEvents } from '@/hooks/useEvents'
import { useLeaderboards } from '@/hooks/useLeaderboards'
import { StatCounter } from '@/components/ui/StatCounter'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { DATA_CONFIG } from '@/config/data'

/**
 * "BY THE NUMBERS" — derived live from the events + standings feeds,
 * so the numbers grow with the season instead of being hardcoded.
 */
export function SeasonStats() {
  const { data: events } = useEvents()
  const { data: standings } = useLeaderboards()

  const eventsHeld = events?.filter(e => e.status === 'completed').length ?? 0
  const players = standings ? new Set(standings.map(s => s.player_name)).size : 0
  const champions = standings
    ? new Set(standings.filter(s => s.rank === 1).map(s => s.player_name)).size
    : 0
  const seasons = DATA_CONFIG.club.seasons.length

  return (
    <section className="relative px-gutter py-section overflow-hidden">
      <div className="hud-rule absolute top-0 left-gutter right-gutter" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <HudLabel className="justify-center">SEASON TELEMETRY</HudLabel>
          <h2 className="type-h2 mt-4" style={{ color: 'var(--text-hi)' }}>
            BY THE NUMBERS
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
          <SectionReveal delay={0}>
            <StatCounter value={eventsHeld} label="EVENTS HELD" />
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <StatCounter value={players} label="PLAYERS COMPETED" />
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <StatCounter value={seasons} label="SEASONS" />
          </SectionReveal>
          <SectionReveal delay={0.24}>
            <StatCounter value={champions} label="CHAMPIONS CROWNED" />
          </SectionReveal>
        </div>
      </div>

      <div className="hud-rule absolute bottom-0 left-gutter right-gutter" aria-hidden="true" />
    </section>
  )
}
