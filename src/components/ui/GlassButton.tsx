'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function GlassButton({
  children,
  href,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: GlassButtonProps) {
  const sizeClass =
    size === 'sm' ? 'px-4 py-2 text-[0.75rem]'
    : size === 'lg' ? 'px-10 py-4 text-[0.9rem]'
    : 'px-6 py-3 text-[0.8rem]'

  const baseClass = `
    inline-flex items-center justify-center gap-2
    liquid-glass rounded-sm
    font-medium tracking-[0.12em] uppercase
    text-text-secondary
    border border-[rgba(157,78,221,0.25)]
    transition-all duration-200
    hover:border-[rgba(157,78,221,0.5)] hover:text-text-primary hover:bg-[rgba(123,47,190,0.1)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
    ${sizeClass} ${className}
  `

  if (href && !disabled) {
    return (
      <Link href={href} className={baseClass.trim()}
        style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}>
        {children}
      </Link>
    )
  }

  return (
    <button className={baseClass.trim()} disabled={disabled}
      style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}
      {...props}>
      {children}
    </button>
  )
}
