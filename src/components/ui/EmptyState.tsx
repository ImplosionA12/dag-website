import { HudFrame } from './HudFrame'
import { clsx } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  message?: string
  className?: string
}

/**
 * Designed absence — "NO DATA // STANDBY". Every data section renders this
 * instead of a blank when sheets return nothing (the default dev state).
 */
export function EmptyState({
  title = 'NO DATA // STANDBY',
  message = 'Transmission pending. Check back when the season heats up.',
  className = '',
}: EmptyStateProps) {
  return (
    <HudFrame className={clsx('px-8 py-14 text-center', className)}>
      <p className="type-hud mb-3" style={{ color: 'var(--text-mid)', letterSpacing: '0.2em' }}>
        {title}
      </p>
      <p className="type-body" style={{ color: 'var(--text-lo)', maxWidth: 420, margin: '0 auto' }}>
        {message}
      </p>
    </HudFrame>
  )
}
