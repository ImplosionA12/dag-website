import { clsx } from '@/lib/utils'

interface HudLabelProps {
  children: React.ReactNode
  /** Blinking status dot before the text */
  live?: boolean
  /** Dot + text color override (defaults to zone accent for dot, muted for text) */
  color?: string
  className?: string
}

/**
 * Telemetry micro-label — "SZN 01 // LIVE" style readouts.
 */
export function HudLabel({ children, live = false, color, className = '' }: HudLabelProps) {
  return (
    <span
      className={clsx('type-label inline-flex items-center gap-2', className)}
      style={{ color: color ?? 'var(--text-mid)' }}
    >
      {live && (
        <span
          className="animate-flicker"
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            background: color ?? 'var(--zone-accent)',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  )
}
