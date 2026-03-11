import type { Metadata } from 'next'
import { NeonButton } from '@/components/ui/NeonButton'
import { GlassButton } from '@/components/ui/GlassButton'

export const metadata: Metadata = {
  title: 'About — The Lore',
  description: 'The origin story of DAG — Drushya Animations & Gaming.',
}

const GAMES = [
  { label: 'FREE FIRE',  color: '#FF6B35', bg: 'rgba(255,69,0,0.1)',    border: 'rgba(255,69,0,0.3)'    },
  { label: 'BGMI',       color: '#4FC3F7', bg: 'rgba(79,195,247,0.1)',  border: 'rgba(79,195,247,0.3)'  },
  { label: 'VALORANT',   color: '#FF4655', bg: 'rgba(255,70,85,0.1)',   border: 'rgba(255,70,85,0.3)'   },
  { label: 'ANIME',      color: '#E040FB', bg: 'rgba(224,64,251,0.1)',  border: 'rgba(224,64,251,0.3)'  },
  { label: 'BLENDER',    color: '#FFB703', bg: 'rgba(255,183,3,0.08)',  border: 'rgba(255,183,3,0.25)'  },
  { label: 'AFTER EFFECTS', color: '#9D4EDD', bg: 'rgba(123,47,190,0.1)', border: 'rgba(157,78,221,0.3)' },
]

export default function AboutPage() {
  return (
    <div
      className="page-content"
      style={{
        background: `
          radial-gradient(ellipse 80% 40% at 50% 0%, rgba(123,47,190,0.07) 0%, transparent 60%),
          var(--bg-void)
        `,
        minHeight: '100vh',
      }}
    >
      {/* ── Editorial Hero ──────────────────────────────────────────────────── */}
      <div
        className="relative px-6 md:px-10 pt-16 pb-20 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 50%, rgba(74,26,122,0.18) 0%, transparent 65%),
            var(--bg-void)
          `,
        }}
      >
        {/* Background atmospheric text */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 700,
            fontSize: 'clamp(5rem, 22vw, 18rem)',
            color: 'rgba(123,47,190,0.025)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          DAG
        </div>

        <div className="relative max-w-4xl mx-auto">
          <p
            className="text-label mb-4"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
          >
            THE LORE
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: 'var(--text-primary)',
              marginBottom: '2rem',
            }}
          >
            We Are{' '}
            <span className="text-violet-gradient">DAG</span>
          </h1>
          <p
            className="text-body"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              lineHeight: 1.85,
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            }}
          >
            Drushya Animations &amp; Gaming was born from a simple belief — that the best gaming
            culture is built by the people who care most about it. Not just the players, but the
            creators and the watchers. The ones who render the highlights, run the workshops,
            host the screenings, and give every victory a cinematic weight it deserves.
          </p>
        </div>
      </div>

      {/* ── Two Wings ──────────────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-section"
        style={{
          borderTop: '1px solid rgba(157,78,221,0.08)',
          borderBottom: '1px solid rgba(157,78,221,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p
            className="text-label text-center mb-4"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
          >
            STRUCTURE
          </p>
          <h2 className="text-section-heading text-center mb-16" style={{ color: 'var(--text-primary)' }}>
            Two Wings,{' '}
            <span className="text-violet-gradient">One Club</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Gaming */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(123,47,190,0.05)',
                border: '1px solid rgba(157,78,221,0.15)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '3px',
                  background: 'var(--violet-core)',
                  marginBottom: '1.5rem',
                  borderRadius: '2px',
                }}
              />
              <h3
                className="text-card-title mb-3"
                style={{ color: 'var(--violet-bright)' }}
              >
                Gaming Wing
              </h3>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Structured tournaments, seasonal rankings, and performance tracking.
                From weekly intraclub matches to championship finals — every battle is
                on the record. We do not play casually. We play to leave a mark.
              </p>
            </div>

            {/* Animation */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(255,183,3,0.04)',
                border: '1px solid rgba(255,183,3,0.15)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '3px',
                  background: 'var(--gold-core)',
                  marginBottom: '1.5rem',
                  borderRadius: '2px',
                }}
              />
              <h3
                className="text-card-title mb-3"
                style={{ color: 'var(--gold-core)' }}
              >
                Animation Wing
              </h3>
              <p className="text-body mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                The Animation wing runs on two tracks — and both matter equally.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <p
                    className="text-label mb-1"
                    style={{
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.18em',
                      color: 'var(--gold-core)',
                    }}
                  >
                    CREATION
                  </p>
                  <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.85rem' }}>
                    Blender, After Effects, motion graphics, VFX, and 3D rendering.
                    We produce season recaps, event highlights, and the visual identity
                    of DAG itself. Workshops bring these skills to anyone who wants to learn.
                  </p>
                </div>
                <div>
                  <p
                    className="text-label mb-1"
                    style={{
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.18em',
                      color: '#E040FB',
                    }}
                  >
                    ANIME CULTURE
                  </p>
                  <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.85rem' }}>
                    Communal screenings, episode discussions, and genuine appreciation
                    for the craft of animation. We celebrate anime as an art form —
                    not just as entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Games We Play ──────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-section max-w-7xl mx-auto">
        <p
          className="text-label mb-4"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
        >
          WHAT WE DO
        </p>
        <h2 className="text-section-heading mb-10" style={{ color: 'var(--text-primary)' }}>
          Games, Tools &amp; Crafts
        </h2>
        <div className="flex flex-wrap gap-3">
          {GAMES.map(({ label, color, bg, border }) => (
            <span
              key={label}
              className="text-label px-5 py-2.5 rounded-sm"
              style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                color,
                background: bg,
                border: `1px solid ${border}`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Vision & Mission ───────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-section"
        style={{ borderTop: '1px solid rgba(157,78,221,0.08)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p
              className="text-label mb-3"
              style={{ color: 'var(--violet-bright)', letterSpacing: '0.2em' }}
            >
              VISION
            </p>
            <h3 className="text-card-title mb-5" style={{ color: 'var(--text-primary)' }}>
              Build the Arena
            </h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
              To be the most feared and respected gaming club in our college — and eventually
              beyond it. Every season, we raise the bar. Every year, the arena grows. The goal
              is not participation; it is excellence.
            </p>
          </div>
          <div>
            <p
              className="text-label mb-3"
              style={{ color: 'var(--gold-core)', letterSpacing: '0.2em' }}
            >
              MISSION
            </p>
            <h3 className="text-card-title mb-5" style={{ color: 'var(--text-primary)' }}>
              Tell the Story
            </h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
              Give every match, every player, and every season the story it deserves. Through
              structured competition, cinematic documentation, and a community that genuinely
              cares — DAG makes gaming feel like it matters. Because it does.
            </p>
          </div>
        </div>
      </section>

      {/* ── Season Timeline ────────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-section"
        style={{ borderTop: '1px solid rgba(157,78,221,0.08)' }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-label mb-4"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
          >
            HISTORY
          </p>
          <h2 className="text-section-heading mb-12" style={{ color: 'var(--text-primary)' }}>
            Season Timeline
          </h2>

          {/* S1 */}
          <div className="relative pl-8">
            {/* Line */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'linear-gradient(to bottom, var(--gold-core), rgba(123,47,190,0.2))',
                borderRadius: '2px',
              }}
            />
            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: '-5px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--gold-core)',
                boxShadow: '0 0 12px rgba(255,183,3,0.5)',
              }}
            />

            <div
              className="p-6 rounded-lg"
              style={{
                background: 'rgba(255,183,3,0.04)',
                border: '1px solid rgba(255,183,3,0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-label px-3 py-1"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: 'var(--gold-core)',
                    background: 'rgba(255,183,3,0.1)',
                    border: '1px solid rgba(255,183,3,0.3)',
                    borderRadius: '2px',
                  }}
                >
                  SEASON 1
                </span>
                <span
                  className="text-label"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.12em',
                    color: '#4ade80',
                  }}
                >
                  ACTIVE
                </span>
              </div>
              <h4
                className="text-card-title mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                The Beginning
              </h4>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Season 1 is where it all starts. The first tournaments, the first champions, the
                first entries in the Hall of Fame. Every legendary run has a beginning.
                This is ours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-section-lg text-center"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 50%, rgba(74,26,122,0.2) 0%, transparent 70%),
            var(--bg-primary)
          `,
          borderTop: '1px solid rgba(157,78,221,0.08)',
        }}
      >
        <p
          className="text-label mb-4"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}
        >
          JOIN THE STORY
        </p>
        <h2
          className="text-page-heading mb-10"
          style={{ color: 'var(--text-primary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}
        >
          Ready to Enter{' '}
          <span className="text-violet-gradient">the Arena?</span>
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <NeonButton href="/events" size="lg" pulse={false}>
            SEE EVENTS
          </NeonButton>
          <GlassButton href="/members" size="lg">
            MEET THE SQUAD
          </GlassButton>
        </div>
      </section>
    </div>
  )
}
