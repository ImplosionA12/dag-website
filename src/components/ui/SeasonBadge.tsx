import { clsx } from '@/lib/utils'

interface SeasonBadgeProps {
  season: string
  className?: string
}

/**
 * Season chip — "S1" telemetry tag in HUD type.
 */
export function SeasonBadge({ season, className = '' }: SeasonBadgeProps) {
  return (
    <span
      className={clsx('inline-flex items-center px-2 py-0.5 text-[0.58rem]', className)}
      style={{
        border: '1px solid var(--line-2)',
        color: 'var(--text-mid)',
        fontFamily: 'var(--font-hud), monospace',
        fontWeight: 500,
        letterSpacing: '0.16em',
      }}
    >
      {season.toUpperCase()}
    </span>
  )
}
