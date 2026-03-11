'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { GlitchReveal } from '@/components/ui/GlitchReveal'
import { NeonButton } from '@/components/ui/NeonButton'
import { GlassButton } from '@/components/ui/GlassButton'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Three.js — dynamic import, desktop only, never SSR
const ParticleSphere = dynamic(() => import('@/components/three/ParticleSphere'), {
  ssr: false,
  loading: () => null,
})

export function Hero() {
  const [revealed, setRevealed] = useState(false)
  const reducedMotion = useReducedMotion()

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 70% 90% at 25% 50%, rgba(74,26,122,0.35) 0%, transparent 65%),
          radial-gradient(ellipse 90% 60% at 70% 55%, rgba(123,47,190,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 100% 50% at 50% 100%, rgba(74,26,122,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 50% 0%,   rgba(10,8,18,0.8)   0%, transparent 80%),
          var(--bg-void)
        `,
      }}
    >
      {/* ── Three.js particle sphere — desktop only ─────────────────────── */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <ParticleSphere />
        </div>
      )}

      {/* ── Mobile CSS sphere fallback ──────────────────────────────────── */}
      {reducedMotion && (
        <div
          className="absolute pointer-events-none"
          aria-hidden
          style={{
            zIndex: 0,
            right: '-10%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '70vw',
            height: '70vw',
            maxWidth: '420px',
            maxHeight: '420px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 40% 40%, rgba(157,78,221,0.25) 0%, rgba(74,26,122,0.15) 40%, transparent 70%),
              radial-gradient(circle at 60% 60%, rgba(255,183,3,0.1) 0%, transparent 50%)
            `,
            border: '1px solid rgba(157,78,221,0.1)',
          }}
        />
      )}

      {/* ── Content ────────────────────────────────────────────────────── */}
      {/*
        willChange: transform forces this div onto its own GPU compositing layer,
        ensuring it renders above the Three.js WebGL canvas regardless of how
        the browser's compositor handles WebGL stacking contexts.
      */}
      <div
        className="flex flex-col items-center md:items-start"
        style={{
          position: 'relative',
          zIndex: 10,
          willChange: 'transform',
          padding: 'clamp(2rem, 6vw, 5rem)',
          paddingTop: 'calc(var(--ticker-height) + var(--navbar-height) + 3rem)',
          paddingBottom: '6rem',
          width: '100%',
          maxWidth: '640px',
        }}
      >
        {/* Eyebrow label */}
        <p
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            opacity: 0.8,
          }}
        >
          DRUSHYA ANIMATIONS &amp; GAMING
        </p>

        {/* Glitch reveal — THE logo moment */}
        <GlitchReveal
          onComplete={() => setRevealed(true)}
          className="items-center md:items-start"
        />

        {/* Tagline — fades in after glitch completes */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
            letterSpacing: '0.22em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            marginTop: '2rem',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          Where Gaming Meets Animation
        </p>

        {/* CTAs — both centered together, fade in after glitch */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            marginTop: '2.5rem',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
          // On desktop align left with the text
          className="md:justify-start"
        >
          <NeonButton href="/events" size="lg" pulse>
            ENTER THE ARENA
          </NeonButton>
          <GlassButton href="/leaderboards" size="lg">
            VIEW LEADERBOARDS
          </GlassButton>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: revealed ? 0.5 : 0,
            transition: 'opacity 0.8s ease 0.5s',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              color: 'var(--text-muted)',
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, var(--violet-core), transparent)',
              animation: 'scrollBounce 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Subtle vignette at edges ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          zIndex: 2,
          background: `
            linear-gradient(to right, rgba(6,5,10,0.5) 0%, transparent 30%, transparent 70%, rgba(6,5,10,0.6) 100%),
            linear-gradient(to bottom, rgba(6,5,10,0.3) 0%, transparent 20%, transparent 80%, rgba(6,5,10,0.4) 100%)
          `,
        }}
      />

    </section>
  )
}
