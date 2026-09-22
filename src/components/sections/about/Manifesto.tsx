'use client'

import { Contributor, GameType } from '@/types'
import { GAME_COLORS, GAME_LABELS } from '@/lib/utils'
import { HudLabel } from '@/components/ui/HudLabel'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { CTAButton } from '@/components/ui/CTAButton'
import { DATA_CONFIG } from '@/config/data'
import { seasonTag } from '@/lib/utils'

const GAMES: GameType[] = ['FF', 'BGMI', 'Valorant', 'Anime']

interface ChapterProps {
  index: string
  label: string
  children: React.ReactNode
}

function Chapter({ index, label, children }: ChapterProps) {
  return (
    <section className="relative px-gutter py-section" aria-label={label}>
      {/* Faded rule rather than a hard border — see MarqueeStrip. */}
      <div className="hud-rule absolute top-0 left-gutter right-gutter" aria-hidden="true" />

      <div className="max-w-5xl mx-auto grid md:grid-cols-[8rem_1fr] gap-8 md:gap-16">
        <SectionReveal>
          <div className="md:sticky md:top-32">
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--line-2)',
              }}
            >
              {index}
            </span>
            <p className="type-label mt-3" style={{ color: 'var(--zone-accent)' }}>
              {label}
            </p>
          </div>
        </SectionReveal>
        <div>{children}</div>
      </div>
    </section>
  )
}

interface ManifestoProps {
  /** The web crew. Empty or absent drops the chapter rather than showing an empty one. */
  contributors?: Contributor[]
}

/**
 * The lore page — chaptered manifesto scroll.
 */
export function Manifesto({ contributors = [] }: ManifestoProps) {
  const hasCrew = contributors.length > 0

  return (
    <div>
      <Chapter index="01" label="// ORIGIN">
        <SectionReveal>
          <DisplayHeading
            lines={['BORN IN THE', 'LOBBY QUEUE']}
            scale="h2"
            colors={[undefined, 'var(--zone-accent)']}
            className="mb-8"
          />
          <p className="type-body mb-5 max-w-xl" style={{ color: 'var(--text-mid)' }}>
            DAG started the way every good squad does — a handful of players who kept
            running into each other in ranked lobbies and a group chat that would not
            stay quiet. Drushya Animations &amp; Gaming made it official: a club where
            the grind and the craft share one roof.
          </p>
          <p className="type-body max-w-xl" style={{ color: 'var(--text-mid)' }}>
            Season 1 was the first broadcast. Everything on this site — the standings,
            the trophies, the polls — is written live as it happens.
          </p>
        </SectionReveal>
      </Chapter>

      <Chapter index="02" label="// TWO WINGS">
        <SectionReveal>
          <DisplayHeading
            lines={['PLAY IT.', 'DRAW IT.']}
            scale="h2"
            colors={['var(--text-hi)', 'var(--game-anime)']}
            className="mb-8"
          />
          <p className="type-body mb-8 max-w-xl" style={{ color: 'var(--text-mid)' }}>
            The Gaming wing runs tournaments, scrims, and the season leaderboard.
            The Animation wing runs screenings, workshops, and original frames.
            Different disciplines, same obsession: doing the thing properly.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {GAMES.map(game => (
              <span
                key={game}
                className="type-label px-3 py-1.5"
                style={{
                  color: GAME_COLORS[game],
                  border: `1px solid ${GAME_COLORS[game]}40`,
                }}
              >
                {GAME_LABELS[game].toUpperCase()}
              </span>
            ))}
          </div>
        </SectionReveal>
      </Chapter>

      <Chapter index="03" label="// THE CODE">
        <SectionReveal>
          <DisplayHeading lines={['HOW WE', 'OPERATE']} scale="h2" className="mb-10" />
          <ul className="grid gap-6 max-w-xl list-none">
            {[
              ['COMPETE HARD', 'Bring your best game. Respect the bracket, respect the opponent.'],
              ['CREATE LOUD', 'Finished frames beat perfect intentions. Ship the work.'],
              ['NO GATEKEEPING', 'Bronze or radiant, beginner or veteran — the lobby is open.'],
              ['THE CLUB WINS', 'Individual glory goes on the leaderboard. The club goes on the banner.'],
            ].map(([title, copy], i) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
                <span className="type-hud" style={{ color: 'var(--zone-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="type-h3 mb-1" style={{ color: 'var(--text-hi)', fontSize: '1.05rem' }}>
                    {title}
                  </p>
                  <p className="type-body" style={{ color: 'var(--text-mid)', fontSize: '0.88rem' }}>
                    {copy}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </Chapter>

      {hasCrew && (
        <Chapter index="04" label="// THE CREW">
          <SectionReveal>
            <DisplayHeading lines={['BUILT BY', 'THE CLUB']} scale="h2" className="mb-8" />
            <p className="type-body mb-10 max-w-xl" style={{ color: 'var(--text-mid)' }}>
              No agency, no template. This site is designed, coded and run by DAG members.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-6 max-w-2xl list-none">
              {contributors.map((person, i) => (
                <li key={person.name} className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
                  <span className="type-hud" style={{ color: 'var(--zone-accent)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="type-h3 mb-1" style={{ color: 'var(--text-hi)', fontSize: '1.05rem' }}>
                      {person.github ? (
                        <a
                          href={`https://github.com/${person.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-4"
                        >
                          {person.name.toUpperCase()}
                        </a>
                      ) : (
                        person.name.toUpperCase()
                      )}
                    </p>
                    <p className="type-body" style={{ color: 'var(--text-mid)', fontSize: '0.88rem' }}>
                      {person.contribution}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </Chapter>
      )}

      <Chapter index={hasCrew ? '05' : '04'} label="// JOIN">
        <SectionReveal>
          <DisplayHeading
            lines={['YOUR SLOT IS', 'STILL OPEN']}
            scale="h2"
            colors={[undefined, 'var(--zone-accent)']}
            className="mb-8"
          />
          <p className="type-body mb-10 max-w-xl" style={{ color: 'var(--text-mid)' }}>
            The roster grows every season. If any of this sounded like you,
            the form takes two minutes.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <CTAButton href={DATA_CONFIG.forms.joinUs || '#'} size="lg">
              JOIN THE CLUB
            </CTAButton>
            <HudLabel>RECRUITMENT // SZN {seasonTag()}</HudLabel>
          </div>
        </SectionReveal>
      </Chapter>
    </div>
  )
}
