import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Colors — mapped to CSS variables so zone theming works per page ─
      colors: {
        void:        'var(--void)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',

        violet: {
          700: 'var(--violet-700)',
          500: 'var(--violet-500)',
          300: 'var(--violet-300)',
        },

        // Gold is VICTORY ONLY: primary CTAs, rank #1, Hall of Fame zone
        gold: {
          600: 'var(--gold-600)',
          400: 'var(--gold-400)',
          200: 'var(--gold-200)',
        },

        game: {
          ff:       'var(--game-ff)',
          bgmi:     'var(--game-bgmi)',
          valorant: 'var(--game-valorant)',
          anime:    'var(--game-anime)',
          other:    'var(--game-other)',
        },

        zone: 'var(--zone-accent)',

        ink: {
          hi:  'var(--text-hi)',
          mid: 'var(--text-mid)',
          lo:  'var(--text-lo)',
        },

        line: {
          1: 'var(--line-1)',
          2: 'var(--line-2)',
        },
      },

      // ─── Font Families ───────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        hud:     ['var(--font-hud)', 'monospace'],
        body:    ['var(--font-body)', 'sans-serif'],
      },

      // ─── Z-Index Scale ───────────────────────────────────────────────────
      zIndex: {
        menu:       '45',
        nav:        '50',
        ticker:     '60',
        transition: '80',
        grain:      '90',
        cursor:     '100',
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      spacing: {
        gutter:     'var(--gutter)',
        ticker:     'var(--ticker-h)',
        nav:        'var(--nav-h)',
        'page-top': 'var(--page-top)',
        section:    'clamp(6rem, 14vh, 11rem)',
      },

      // ─── Animation ───────────────────────────────────────────────────────
      animation: {
        marquee:      'marquee 32s linear infinite',
        shimmer:      'shimmer 1.8s ease-in-out infinite',
        flicker:      'flicker 1.6s steps(2) infinite',
        'pulse-gold': 'pulseGold 2.8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.25' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,183,3,0.25), 0 0 28px rgba(255,183,3,0.10)' },
          '50%':      { boxShadow: '0 0 18px rgba(255,183,3,0.50), 0 0 48px rgba(255,183,3,0.20)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
