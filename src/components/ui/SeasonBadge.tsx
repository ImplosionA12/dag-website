interface SeasonBadgeProps {
  season: string
  className?: string
}

export function SeasonBadge({ season, className = '' }: SeasonBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[0.6rem] tracking-widest ${className}`}
      style={{
        backgroundColor: 'rgba(123, 47, 190, 0.15)',
        border: '1px solid rgba(157, 78, 221, 0.3)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-orbitron), monospace',
        letterSpacing: '0.12em',
      }}
    >
      {season.toUpperCase()}
    </span>
  )
}
