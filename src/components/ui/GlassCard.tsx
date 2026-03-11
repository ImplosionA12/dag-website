import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  neonVariant?: 'violet' | 'gold' | 'none'
  padding?: 'sm' | 'md' | 'lg'
}

export function GlassCard({
  children,
  className = '',
  neonVariant = 'none',
  padding = 'md',
}: GlassCardProps) {
  const neonClass =
    neonVariant === 'violet' ? 'neon-border-violet'
    : neonVariant === 'gold' ? 'neon-border-gold'
    : ''

  const paddingClass =
    padding === 'sm' ? 'p-4'
    : padding === 'lg' ? 'p-8'
    : 'p-6'

  return (
    <div
      className={`liquid-glass rounded-lg ${paddingClass} ${neonClass} ${className}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {children}
    </div>
  )
}
