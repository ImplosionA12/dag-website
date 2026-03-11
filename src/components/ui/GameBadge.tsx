import { GameType } from '@/types'

const BADGE_STYLES: Record<GameType, { bg: string; border: string; text: string; label: string }> = {
  FF:       { bg: 'rgba(255,69,0,0.15)',    border: 'rgba(255,69,0,0.5)',    text: '#FF6B35', label: 'FREE FIRE'  },
  BGMI:     { bg: 'rgba(79,195,247,0.15)',  border: 'rgba(79,195,247,0.5)',  text: '#4FC3F7', label: 'BGMI'       },
  Valorant: { bg: 'rgba(255,70,85,0.15)',   border: 'rgba(255,70,85,0.5)',   text: '#FF4655', label: 'VALORANT'   },
  Anime:    { bg: 'rgba(224,64,251,0.15)',  border: 'rgba(224,64,251,0.5)',  text: '#E040FB', label: 'ANIME'      },
  Other:    { bg: 'rgba(155,143,168,0.15)', border: 'rgba(155,143,168,0.4)', text: '#9B8FA8', label: 'OTHER'      },
}

interface GameBadgeProps {
  game: GameType
  size?: 'sm' | 'md'
  className?: string
}

export function GameBadge({ game, size = 'sm', className = '' }: GameBadgeProps) {
  const style = BADGE_STYLES[game] ?? BADGE_STYLES['Other']

  return (
    <span
      className={`inline-flex items-center rounded-sm font-medium tracking-widest ${
        size === 'sm' ? 'px-2 py-0.5 text-[0.6rem]' : 'px-3 py-1 text-[0.7rem]'
      } ${className}`}
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontFamily: 'var(--font-orbitron), monospace',
        letterSpacing: '0.1em',
      }}
    >
      {style.label}
    </span>
  )
}
