import { clsx } from '@/lib/utils'

interface SurfaceProps {
  children: React.ReactNode
  className?: string
  /** Diagonal notch cut into the top-right corner */
  notch?: boolean
  /** Left edge accent bar color (e.g. a game color) */
  edge?: string
}

/**
 * Matte broadcast panel — surface-2 fill, hairline border, corner notch.
 * Replaces the old glassmorphism card. No backdrop-filter.
 */
export function Surface({ children, className = '', notch = true, edge }: SurfaceProps) {
  return (
    <div
      className={clsx('relative', className)}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--line-1)',
        ...(edge && { borderLeft: `2px solid ${edge}` }),
        ...(notch && {
          clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
        }),
      }}
    >
      {notch && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -1,
            right: -1,
            width: 26,
            height: 1,
            background: 'var(--line-2)',
            transform: 'rotate(45deg)',
            transformOrigin: 'right top',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  )
}
