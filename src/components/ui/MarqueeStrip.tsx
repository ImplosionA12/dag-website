import { clsx } from '@/lib/utils'

interface MarqueeStripProps {
  items: string[]
  /** One item highlighted in solid zone accent instead of outline */
  className?: string
}

/**
 * Giant outlined display text scrolling between scenes — a broadcast
 * interstitial. Decorative; duplicated content is aria-hidden.
 */
export function MarqueeStrip({ items, className = '' }: MarqueeStripProps) {
  const content = items.map(item => `${item}  //  `).join('')

  return (
    <div
      aria-hidden="true"
      className={clsx('relative overflow-hidden py-8 select-none', className)}
      style={{ borderTop: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)' }}
    >
      <div
        className="animate-marquee items-center"
        style={{ width: 'max-content', animationDuration: '70s' }}
      >
        {[0, 1].map(copy => (
          <span
            key={copy}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              color: 'transparent',
              WebkitTextStroke: '1px var(--line-2)',
            }}
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  )
}
