'use client'

import Link from 'next/link'
import { clsx } from '@/lib/utils'

interface GhostButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  size?: 'md' | 'lg'
  className?: string
}

/**
 * Secondary outline button — hairline border, takes the zone accent on hover.
 * The diagonal clip lives on the inner fill so the keyboard focus ring on the
 * outer element stays visible. Visuals in .ghost-btn / .ghost-fill (globals.css).
 */
export function GhostButton({
  children,
  href,
  onClick,
  size = 'md',
  className = '',
}: GhostButtonProps) {
  const sharedClass = clsx('ghost-btn inline-flex select-none', className)

  const inner = (
    <span
      className={clsx(
        'ghost-fill diag inline-flex items-center justify-center',
        size === 'lg' ? 'px-12 py-4 text-[0.8rem]' : 'px-8 py-3 text-[0.7rem]'
      )}
    >
      {children}
    </span>
  )

  const isExternal = href && /^https?:\/\//.test(href)

  if (href && isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-magnetic className={sharedClass}>
        {inner}
      </a>
    )
  }

  if (href) {
    return (
      <Link href={href} data-magnetic className={sharedClass}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} data-magnetic className={sharedClass}>
      {inner}
    </button>
  )
}
