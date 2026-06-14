'use client'

import Link from 'next/link'
import { clsx } from '@/lib/utils'

interface CTAButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  size?: 'md' | 'lg'
  /** Gold pulse glow — reserve for the single most important CTA on a page */
  pulse?: boolean
  className?: string
}

/**
 * The gold victory CTA — slashed parallelogram, void text on gold.
 * Gold is rationed: this component, RankTag(#1), and the HoF zone are
 * the only gold consumers in the codebase.
 * `data-magnetic` lets the custom cursor apply magnetic pull on desktop.
 */
export function CTAButton({
  children,
  href,
  onClick,
  size = 'md',
  pulse = false,
  className = '',
}: CTAButtonProps) {
  const padding = size === 'lg' ? 'px-12 py-4 text-[0.8rem]' : 'px-8 py-3 text-[0.7rem]'

  const sharedClass = clsx(
    'cta-btn relative inline-flex select-none transition-transform duration-200',
    pulse && 'animate-pulse-gold',
    className
  )

  const inner = (
    <span className={clsx('cta-fill diag inline-flex items-center justify-center gap-3', padding)}>
      {children}
      <span aria-hidden="true" style={{ fontWeight: 400 }}>{'//'}</span>
    </span>
  )

  const isExternal = href && /^https?:\/\//.test(href)

  if (href && isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-magnetic
        className={sharedClass}
        style={{ textDecoration: 'none' }}
      >
        {inner}
      </a>
    )
  }

  if (href) {
    return (
      <Link href={href} data-magnetic className={sharedClass} style={{ textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} data-magnetic className={sharedClass} style={{ border: 'none', background: 'transparent' }}>
      {inner}
    </button>
  )
}
