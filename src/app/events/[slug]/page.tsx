import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchEventsFeed, fetchLeaderboardsFeed } from '@/lib/feeds'
import {
  eventSlug,
  findEventBySlug,
  formatDate,
  isFutureDate,
  standingsForEvent,
  seasonTag,
  GAME_COLORS,
  GAME_LABELS,
} from '@/lib/utils'
import { Event } from '@/types'
import { HudFrame } from '@/components/ui/HudFrame'
import { HudLabel } from '@/components/ui/HudLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { GameBadge } from '@/components/ui/GameBadge'
import { SeasonBadge } from '@/components/ui/SeasonBadge'
import { CTAButton } from '@/components/ui/CTAButton'
import { GhostButton } from '@/components/ui/GhostButton'
import { MissionCountdown } from '@/components/sections/events/MissionCountdown'
import { MissionStandings } from '@/components/sections/events/MissionStandings'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

/** Matches the feeds' own ISR window, so a dossier is never staler than the board. */
export const revalidate = 60

/**
 * Pre-render the events present at build time. Unknown slugs still render on demand
 * (dynamicParams defaults to true), so an event added to the sheet after a deploy gets a
 * page without a rebuild — the same promise the ISR board already makes.
 */
export async function generateStaticParams() {
  try {
    const events = await fetchEventsFeed()
    return (events ?? []).map(event => ({ slug: eventSlug(event) }))
  } catch {
    // A cold or broken feed must not fail the build — these pages render on request.
    return []
  }
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const events = await fetchEventsFeed()
    return events ? findEventBySlug(events, slug) : null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const event = await getEvent(params.slug)

  if (!event) {
    return { title: 'Mission not found', robots: { index: false } }
  }

  const title = `${event.event_name} — ${GAME_LABELS[event.game_type]}`
  const description =
    event.description ||
    `${event.event_name} — DAG ${event.event_type} on ${formatDate(event.date)}.`
  const url = `/events/${eventSlug(event)}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { title, description },
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)

  if (!event) notFound()

  // Standings are a bonus, never a blocker — a dead leaderboard feed must not 500 a dossier.
  const standings = await fetchLeaderboardsFeed()
    .then(entries => (entries ? standingsForEvent(entries, event) : []))
    .catch(() => [])

  const accent = GAME_COLORS[event.game_type]
  const isCompleted = event.status === 'completed'
  const isOpen = event.status === 'open'
  // An event can be past without being 'completed' — Wipe Out Arena: Reloaded is 'closed'
  // and never ran. Counting down to it, or promising standings later, would both be wrong.
  const isUpcoming = isFutureDate(event.date)
  const statusLabel = isCompleted
    ? 'MISSION COMPLETE'
    : isOpen
      ? 'REGISTRATION OPEN'
      : 'REGISTRATION CLOSED'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.event_name,
            startDate: event.date,
            description: event.description,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            organizer: { '@type': 'Organization', name: 'DAG', url: SITE_URL },
            url: `${SITE_URL}/events/${eventSlug(event)}`,
            ...(isOpen && event.register_url
              ? { offers: { '@type': 'Offer', url: event.register_url } }
              : {}),
          }),
        }}
      />

      <div
        data-zone="events"
        className="pt-page-top"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, ${accent}14 0%, transparent 60%),
            var(--void)
          `,
          minHeight: '100vh',
        }}
      >
        <div className="px-gutter pb-section max-w-5xl mx-auto">
          {/* Both of these are inline elements — without the block wrappers they share a line. */}
          <div className="mt-8 mb-10">
            <Link
              href="/events"
              className="footer-link type-label"
              style={{ color: 'var(--text-lo)' }}
            >
              ◂ MISSION SELECT
            </Link>
          </div>

          <div className="mb-5">
            <HudLabel live={isOpen} color={accent}>
              {`SZN ${seasonTag(event.season)} // ${statusLabel}`}
            </HudLabel>
          </div>

          <DisplayHeading as="h1" scale="display" lines={[event.event_name]} className="mb-7" />

          <div className="flex flex-wrap items-center gap-2.5 mb-10">
            <GameBadge game={event.game_type} />
            <SeasonBadge season={event.season} />
            <span
              className="type-label px-2 py-0.5"
              style={{ color: 'var(--text-mid)', border: '1px solid var(--line-2)' }}
            >
              {event.event_type.toUpperCase()}
            </span>
            <span className="type-hud" style={{ color: 'var(--text-lo)', fontSize: '0.7rem' }}>
              {formatDate(event.date)}
            </span>
          </div>

          <HudFrame className="p-7 md:p-10 mb-8" tl="BRIEFING" br={event.event_type.toUpperCase()}>
            <div className="pt-4">
              {isUpcoming && <MissionCountdown date={event.date} accent={accent} />}

              {event.description ? (
                <p className="type-body max-w-2xl mt-6" style={{ color: 'var(--text-mid)' }}>
                  {event.description}
                </p>
              ) : (
                <p className="type-body mt-6" style={{ color: 'var(--text-lo)' }}>
                  No briefing recorded for this mission.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-9">
                {isOpen && event.register_url && <CTAButton href={event.register_url}>DEPLOY</CTAButton>}
                {event.recording_url && (
                  <GhostButton href={event.recording_url}>WATCH RECORDING</GhostButton>
                )}
                {!isOpen && !event.recording_url && (
                  <span className="type-label" style={{ color: 'var(--text-lo)' }}>
                    {isUpcoming ? 'STANDBY' : 'ARCHIVED'}
                  </span>
                )}
              </div>
            </div>
          </HudFrame>

          <section aria-labelledby="standings-heading">
            <h2 id="standings-heading" className="type-h3 mb-5" style={{ color: 'var(--text-hi)' }}>
              FINAL STANDINGS
            </h2>

            {standings.length > 0 ? (
              <MissionStandings entries={standings} eventName={event.event_name} />
            ) : (
              <p
                className="type-body py-6"
                style={{ color: 'var(--text-lo)', borderTop: '1px solid var(--line-1)' }}
              >
                {isUpcoming
                  ? 'Standings post here once the mission completes.'
                  : 'No standings recorded for this mission.'}
              </p>
            )}

            <Link
              href="/leaderboards"
              className="footer-link type-label inline-block mt-8"
              style={{ color: 'var(--text-lo)' }}
            >
              SEASON STANDINGS ▸
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
