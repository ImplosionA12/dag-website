import type { Metadata } from 'next'
import { HallOfFameContent } from '@/components/sections/hall-of-fame/HallOfFameContent'

export const metadata: Metadata = {
  title: 'Hall of Fame — The Shrine',
  description: 'DAG Hall of Fame. Season champions, iron players, and legends.',
}

export default function HallOfFamePage() {
  return (
    <div
      className="page-content"
      style={{
        background: `
          radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,183,3,0.07) 0%, transparent 60%),
          var(--bg-void)
        `,
        minHeight: '100vh',
      }}
    >
      {/* Page header */}
      <div className="px-6 md:px-10 pt-16 pb-14 max-w-7xl mx-auto">
        <p
          className="text-label mb-3"
          style={{ color: 'var(--gold-core)', letterSpacing: '0.2em' }}
        >
          THE SHRINE
        </p>
        <h1 className="text-page-heading text-gold-gradient mb-5">
          Hall of Fame
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
          Six sacred categories. One legendary season. The names that defined the arena.
        </p>
      </div>

      <HallOfFameContent />
    </div>
  )
}
