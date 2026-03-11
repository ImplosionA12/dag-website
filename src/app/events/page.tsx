import type { Metadata } from 'next'
import { EventsContent } from '@/components/sections/events/EventsContent'

export const metadata: Metadata = {
  title: 'Events — The Battleground',
  description: 'Upcoming and past DAG tournaments. Register for open battles, view results for completed events.',
}

export default function EventsPage() {
  return (
    <div
      className="page-content"
      style={{
        background: `
          radial-gradient(ellipse 80% 40% at 50% 0%, rgba(123,47,190,0.08) 0%, transparent 60%),
          var(--bg-void)
        `,
        minHeight: '100vh',
      }}
    >
      {/* Page header */}
      <div className="px-6 md:px-10 pt-16 pb-4 max-w-7xl mx-auto">
        <p
          className="text-label mb-3"
          style={{ color: 'var(--ff-color)', letterSpacing: '0.2em' }}
        >
          THE BATTLEGROUND
        </p>
        <h1 className="text-page-heading" style={{ color: 'var(--text-primary)' }}>
          Events
        </h1>
      </div>

      <EventsContent />
    </div>
  )
}
