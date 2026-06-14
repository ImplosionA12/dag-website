import type { Metadata, Viewport } from 'next'
import { Big_Shoulders_Display, Chakra_Petch, Archivo } from 'next/font/google'
import './globals.css'
import { SeasonTicker } from '@/components/layout/SeasonTicker'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { CustomCursor } from '@/components/cinematic/CustomCursor'
import { FilmGrain } from '@/components/cinematic/FilmGrain'
import { AmbientGlow } from '@/components/cinematic/AmbientGlow'
import { ProgressRail } from '@/components/cinematic/ProgressRail'
import { BootSequence } from '@/components/cinematic/BootSequence'
import { validateEnv } from '@/lib/env'

validateEnv()

// ─── Fonts ───────────────────────────────────────────────────────────────────

const bigShoulders = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hud',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

// ─── Metadata ────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050408',
}

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
      className={`${bigShoulders.variable} ${chakraPetch.variable} ${archivo.variable}`}
    >
      <body>
        {/* Skip to main content — visible on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-cursor focus:px-4 focus:py-2 type-label"
          style={{
            background: 'var(--gold-400)',
            color: 'var(--void)',
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

        {/* Fixed chrome: season ticker + navbar */}
        <SeasonTicker />
        <Navbar />

        {/* Page content with enter transitions */}
        <PageTransition>
          <main id="main-content">{children}</main>
        </PageTransition>

        {/* Footer — outside transition so it doesn't re-animate */}
        <Footer />

        {/* Motion + cinematic overlays */}
        <LenisProvider />
        <ProgressRail />
        <AmbientGlow />
        <CustomCursor />
        <FilmGrain />
        <BootSequence />
      </body>
    </html>
  )
}
