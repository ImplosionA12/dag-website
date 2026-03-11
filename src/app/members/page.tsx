import type { Metadata } from 'next'
import { MembersContent } from '@/components/sections/members/MembersContent'

export const metadata: Metadata = {
  title: 'Members — The Roster',
  description: 'Meet the DAG roster. Founders, core team, competitive players, and animators.',
}

export default function MembersPage() {
  return (
    <div
      className="page-content"
      style={{
        background: `
          radial-gradient(ellipse 70% 35% at 50% 0%, rgba(123,47,190,0.08) 0%, transparent 60%),
          var(--bg-void)
        `,
        minHeight: '100vh',
      }}
    >
      {/* Page header */}
      <div className="px-6 md:px-10 pt-16 pb-14 max-w-7xl mx-auto">
        <p
          className="text-label mb-3"
          style={{ color: 'var(--violet-bright)', letterSpacing: '0.2em' }}
        >
          THE ROSTER
        </p>
        <h1 className="text-page-heading mb-5" style={{ color: 'var(--text-primary)' }}>
          Members
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
          The players, the creators, the architects. Every name on this roster chose to build
          something bigger than themselves.
        </p>
      </div>

      <MembersContent />
    </div>
  )
}
