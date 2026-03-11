import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Colors ────────────────────────────────────────────────────────
      colors: {
        // Backgrounds
        'bg-void':      '#06050A',
        'bg-primary':   '#0A0812',
        'bg-secondary': '#100E1A',
        'bg-tertiary':  '#171422',

        // Violet — primary identity
        'violet-deep':   '#4A1A7A',
        'violet-core':   '#7B2FBE',
        'violet-bright': '#9D4EDD',

        // Gold — champions, prestige
        'gold-deep':   '#8B6000',
        'gold-core':   '#FFB703',
        'gold-bright': '#FFD60A',

        // Game-specific accents
        'ff-color':       '#FF4500',
        'bgmi-color':     '#4FC3F7',
        'valorant-color': '#FF4655',
        'anime-color':    '#E040FB',

        // Text
        'text-primary':   '#F0ECF7',
        'text-secondary': '#9B8FA8',
        'text-muted':     '#4A4358',

        // Rank
        'rank-gold':   '#FFB703',
        'rank-silver': '#C0C0C0',
        'rank-bronze': '#CD7F32',
      },

      // ─── Font Families ─────────────────────────────────────────────────
      fontFamily: {
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        orbitron:  ['var(--font-orbitron)', 'monospace'],
      },

      // ─── Spacing ───────────────────────────────────────────────────────
      spacing: {
        'section':    '10rem',
        'section-lg': '12.5rem',
        'ticker':     '2.25rem',
        'navbar':     '4rem',
        'navbar-mobile': '3.5rem',
      },

      // ─── Animation ────────────────────────────────────────────────────
      animation: {
        'marquee':    'marquee 30s linear infinite',
        'neon-pulse': 'neonPulse 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s ease-in-out infinite',
        'gold-bloom': 'goldBloom 0.8s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255,183,3,0.4), 0 0 20px rgba(255,183,3,0.2)' },
          '50%':      { boxShadow: '0 0 16px rgba(255,183,3,0.8), 0 0 40px rgba(255,183,3,0.4), 0 0 60px rgba(255,183,3,0.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        goldBloom: {
          '0%':   { opacity: '0.3' },
          '50%':  { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ─── Box Shadow ────────────────────────────────────────────────────
      boxShadow: {
        'violet-glow': '0 0 20px rgba(123,47,190,0.4)',
        'gold-glow':   '0 0 20px rgba(255,183,3,0.4)',
        'card-hover':  '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(123,47,190,0.15)',
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────────
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}

export default config
