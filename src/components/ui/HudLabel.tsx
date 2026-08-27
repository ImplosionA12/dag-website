import { clsx } from '@/lib/utils'
import { CursorReadout } from './CursorReadout'

interface HudLabelProps {
  children?: React.ReactNode
  /** Blinking status dot before the text */
  live?: boolean
  /** Append a live pointer-coordinate readout — "SIGNAL // 0.412, 0.208" */
  track?: boolean
  /** Dot + text color override (defaults to zone accent for dot, muted for text) */
  color?: string
  className?: string
}

/**
 * Telemetry micro-label — "SZN 01 // LIVE" style readouts.
 *
 * With `track`, the label becomes a live instrument rather than printed text:
 * it appends the pointer's normalized viewport position.
 */
export function HudLabel({
  children,
  live = false,
  track = false,
  color,
  className = '',
}: HudLabelProps) {
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
      {track && <CursorReadout prefix={children ? '//' : 'TRACK //'} />}
    </span>
  )
}
