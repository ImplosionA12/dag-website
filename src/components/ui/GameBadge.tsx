import { GameType } from '@/types'
import { GAME_COLORS, GAME_LABELS, clsx } from '@/lib/utils'

interface GameBadgeProps {
  game: GameType
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Game tag — accent slash + label in HUD type. Color from GAME_COLORS.
 */
export function GameBadge({ game, size = 'sm', className = '' }: GameBadgeProps) {
  const color = GAME_COLORS[game] ?? GAME_COLORS.Other
  const label = (GAME_LABELS[game] ?? GAME_LABELS.Other).toUpperCase()

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5',
        size === 'sm' ? 'px-2 py-0.5 text-[0.58rem]' : 'px-3 py-1 text-[0.68rem]',
        className
      )}
      style={{
        border: '1px solid var(--line-1)',
        color,
        fontFamily: 'var(--font-hud), monospace',
        fontWeight: 600,
        letterSpacing: '0.14em',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 1.5,
          background: color,
          transform: 'skewX(-30deg)',
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  )
}
