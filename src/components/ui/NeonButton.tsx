'use client'

import { ReactNode, useRef, MouseEvent } from 'react'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface NeonButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
  disabled?: boolean
}

export function NeonButton({
  children,
  href,
  onClick,
  size = 'md',
  className = '',
  pulse = true,
  disabled = false,
}: NeonButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  const sizeClass =
    size === 'sm' ? 'px-5 py-2.5 text-[0.75rem]'
    : size === 'lg' ? 'px-12 py-5 text-[0.95rem]'
    : 'px-8 py-4 text-[0.85rem]'

  const baseClass = `
    inline-flex items-center justify-center gap-2
    rounded-sm
    font-semibold tracking-[0.15em] uppercase
    bg-transparent
    text-gold-core
    border border-gold-core
    transition-all duration-200
    hover:bg-[rgba(255,183,3,0.1)] hover:text-gold-bright hover:border-gold-bright
    disabled:opacity-40 disabled:cursor-not-allowed
    ${pulse && !reducedMotion ? 'animate-neon-pulse' : ''}
    ${sizeClass} ${className}
  `.trim().replace(/\s+/g, ' ')

  // Magnetic effect: button shifts slightly toward cursor
  const handleMouseMove = (e: MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }

  const sharedStyle: React.CSSProperties = {
    fontFamily: 'var(--font-rajdhani)',
    letterSpacing: '0.15em',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  }

  if (href && !disabled) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClass}
        style={sharedStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseClass}
      style={sharedStyle}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}
