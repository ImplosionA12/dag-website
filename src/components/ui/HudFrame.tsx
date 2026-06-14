import { clsx } from '@/lib/utils'

interface HudFrameProps {
  children: React.ReactNode
  className?: string
  /** Corner micro-labels, e.g. tl="SZN 01" br="LIVE" */
  tl?: string
  tr?: string
  bl?: string
  br?: string
  /** Brackets pick up the page's zone accent instead of neutral */
  accent?: boolean
  /** Bracket arm length in px */
  size?: number
}

/**
 * Broadcast HUD frame — four corner brackets + optional telemetry labels.
 * The visual signature of the site. Pure CSS, server-renderable.
 */
export function HudFrame({
  children,
  className = '',
  tl,
  tr,
  bl,
  br,
  accent = false,
  size = 14,
}: HudFrameProps) {
  const stroke = accent ? 'var(--zone-accent)' : 'var(--bracket)'

  const corner = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    ...(pos === 'tl' && { top: 0, left: 0, borderTop: `1px solid ${stroke}`, borderLeft: `1px solid ${stroke}` }),
    ...(pos === 'tr' && { top: 0, right: 0, borderTop: `1px solid ${stroke}`, borderRight: `1px solid ${stroke}` }),
    ...(pos === 'bl' && { bottom: 0, left: 0, borderBottom: `1px solid ${stroke}`, borderLeft: `1px solid ${stroke}` }),
    ...(pos === 'br' && { bottom: 0, right: 0, borderBottom: `1px solid ${stroke}`, borderRight: `1px solid ${stroke}` }),
  })

  const label = (text: string, pos: 'tl' | 'tr' | 'bl' | 'br') => (
    <span
      className="type-label"
      aria-hidden="true"
      style={{
        position: 'absolute',
        color: 'var(--text-lo)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        ...(pos === 'tl' && { top: 6, left: size + 8 }),
        ...(pos === 'tr' && { top: 6, right: size + 8 }),
        ...(pos === 'bl' && { bottom: 6, left: size + 8 }),
        ...(pos === 'br' && { bottom: 6, right: size + 8 }),
      }}
    >
      {text}
    </span>
  )

  return (
    <div className={clsx('relative', className)}>
      <span style={corner('tl')} aria-hidden="true" />
      <span style={corner('tr')} aria-hidden="true" />
      <span style={corner('bl')} aria-hidden="true" />
      <span style={corner('br')} aria-hidden="true" />
      {tl && label(tl, 'tl')}
      {tr && label(tr, 'tr')}
      {bl && label(bl, 'bl')}
      {br && label(br, 'br')}
      {children}
    </div>
  )
}
