import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LeaderboardsClient } from '@/components/sections/leaderboards/LeaderboardsClient'

export const metadata: Metadata = {
  title: 'Leaderboards — The Scoreboard Hall',
  description: 'DAG tournament leaderboards. Season rankings, points, and player stats.',
}

function LeaderboardSkeleton() {
  return (
    <div className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
      <div className="skeleton rounded mb-10" style={{ height: '48px', maxWidth: '400px' }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton rounded-sm mb-1" style={{ height: '60px' }} />
      ))}
    </div>
  )
}

export default function LeaderboardsPage() {
  return (
    <div
      className="page-content"
      style={{
        background: `
          radial-gradient(ellipse 60% 30% at 50% 0%, rgba(79,195,247,0.04) 0%, transparent 60%),
          var(--bg-void)
        `,
        minHeight: '100vh',
      }}
    >
      {/* Page header */}
      <div className="px-6 md:px-10 pt-16 pb-10 max-w-4xl mx-auto">
        <p
          className="text-label mb-3"
          style={{ color: 'var(--bgmi-color)', letterSpacing: '0.2em' }}
        >
          THE SCOREBOARD HALL
        </p>
        <h1 className="text-page-heading mb-4" style={{ color: 'var(--text-primary)' }}>
          Leaderboards
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
          Season rankings by event. Every point tracked. Every position earned.
        </p>
      </div>

      {/* useSearchParams requires Suspense in Next.js App Router */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardsClient />
      </Suspense>
    </div>
  )
}
