import type { Metadata } from 'next'
import { Rajdhani, DM_Sans, Orbitron } from 'next/font/google'
import './globals.css'
import { SeasonTicker } from '@/components/layout/SeasonTicker'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'

// ─── Fonts ───────────────────────────────────────────────────────────────────

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-orbitron',
  display: 'swap',
})

// ─── Metadata ────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const metadata: Metadata = {
  title: {
    default: 'DAG — Drushya Animations & Gaming',
    template: '%s | DAG',
  },
  description:
    'DAG is a competitive gaming and animation club. Where Gaming Meets Animation. Tournaments, leaderboards, and a Hall of Fame — Season 1 is active.',
  keywords: ['DAG', 'gaming club', 'Drushya Gaming', 'BGMI', 'Free Fire', 'Valorant', 'anime'],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'DAG — Drushya Animations & Gaming',
    description: 'Where Gaming Meets Animation. Enter the Arena.',
    type: 'website',
    url: '/',
    siteName: 'DAG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DAG — Drushya Animations & Gaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAG — Drushya Animations & Gaming',
    description: 'Where Gaming Meets Animation. Enter the Arena.',
    images: ['/og-image.png'],
  },
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rajdhani.variable} ${dmSans.variable} ${orbitron.variable}`}
    >
      <body>
        {/* SVG filter definition — must live in body, not head */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="liquid-distortion" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.008"
                numOctaves="2"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="4"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Skip to main content — visible on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:px-4 focus:py-2 focus:text-label"
          style={{
            background: 'var(--gold-core)',
            color: 'var(--bg-void)',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Skip to content
        </a>

        {/* JSON-LD — Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DAG — Drushya Animations & Gaming',
              alternateName: 'DAG',
              description: 'Competitive gaming and animation club. Where Gaming Meets Animation.',
              url: SITE_URL,
              logo: `${SITE_URL}/og-image.png`,
            }),
          }}
        />

        {/* Fixed: season ticker at top */}
        <SeasonTicker />

        {/* Fixed: navbar below ticker */}
        <Navbar />

        {/* Page content with transitions */}
        <PageTransition>
          <main id="main-content">
            {children}
          </main>
        </PageTransition>

        {/* Footer — rendered outside transition so it doesn't re-animate */}
        <Footer />
      </body>
    </html>
  )
}
