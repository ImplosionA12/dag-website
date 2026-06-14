'use client'

import { HudFrame } from './HudFrame'
import { GhostButton } from './GhostButton'
import { clsx } from '@/lib/utils'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Standard hook-error surface — "SIGNAL LOST" + retry.
 */
export function ErrorState({
  message = 'The feed dropped mid-broadcast. Re-establish the connection.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <HudFrame className={clsx('px-8 py-14 text-center', className)}>
      <p
        className="type-hud mb-3"
        style={{ color: 'var(--game-valorant)', letterSpacing: '0.2em' }}
        role="alert"
      >
        SIGNAL LOST
      </p>
      <p className="type-body mb-8" style={{ color: 'var(--text-mid)', maxWidth: 420, margin: '0 auto 2rem' }}>
        {message}
      </p>
      {onRetry && <GhostButton onClick={onRetry}>RECONNECT</GhostButton>}
    </HudFrame>
  )
}
