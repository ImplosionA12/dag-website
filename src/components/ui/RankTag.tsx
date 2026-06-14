import { getRankColor, getRankLabel, clsx } from '@/lib/utils'

interface RankTagProps {
  rank: number
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * Standings rank marker. Rank #1 is a gold victory moment — the only
 * gold consumer in the standings besides the podium crown.
 */
export function RankTag({ rank, size = 'sm', className = '' }: RankTagProps) {
  const color = getRankColor(rank)
  const isFirst = rank === 1

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center diag',
        size === 'lg' ? 'min-w-[3.2rem] px-2 py-1 text-[1rem]' : 'min-w-[2.4rem] px-1.5 py-0.5 text-[0.72rem]',
        isFirst && 'animate-pulse-gold',
        className
      )}
      style={{
        fontFamily: 'var(--font-hud), monospace',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.06em',
        color: isFirst ? 'var(--void)' : color,
        background: isFirst ? 'var(--gold-400)' : 'transparent',
        border: isFirst ? '1px solid var(--gold-400)' : `1px solid ${color}40`,
      }}
      aria-label={`Rank ${getRankLabel(rank)}`}
    >
      {getRankLabel(rank)}
    </span>
  )
}
