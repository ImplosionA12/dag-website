'use client'

import { useHallOfFame } from '@/hooks/useHallOfFame'
import { HOF_CATEGORIES } from '@/types'
import { TrophyCard } from './TrophyCard'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

/**
 * The trophy hall — all six categories always render; unclaimed slots
 * are part of the design (something to fight for).
 */
export function TrophyHall() {
  const { data: entries, loading, error, refetch } = useHallOfFame()

  if (loading) {
    return (
      <div
        className="px-gutter pb-section max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        aria-busy="true"
        aria-label="Loading hall of fame"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-72" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-gutter pb-section max-w-3xl mx-auto">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="px-gutter pb-section max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {HOF_CATEGORIES.map(({ category, icon, description }, i) => {
        const entry =
          entries?.find(e => e.category === category && e.player_name) ?? null
        return (
          <SectionReveal key={category} delay={i * 0.07} className="h-full">
            <TrophyCard
              category={category}
              icon={icon}
              description={description}
              entry={entry}
              index={i}
            />
          </SectionReveal>
        )
      })}
    </div>
  )
}
