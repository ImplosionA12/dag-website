'use client'

import { ReactNode, useRef, MouseEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number   // degrees, default 8
  shineOpacity?: number // 0–1, default 0.15
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  shineOpacity = 0.15,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current || !shineRef.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width   // 0–1
    const y = (e.clientY - rect.top)  / rect.height   // 0–1

    const rotateX = (y - 0.5) * -maxTilt * 2  // negative: tilt toward cursor
    const rotateY = (x - 0.5) *  maxTilt * 2

    ref.current.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(8px)
    `
    ref.current.style.transition = 'transform 0.05s ease'

    // Holographic shine follows cursor
    shineRef.current.style.background = `
      radial-gradient(circle at ${x * 100}% ${y * 100}%,
        rgba(255,255,255,${shineOpacity}) 0%,
        transparent 60%)
    `
    shineRef.current.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    if (!ref.current || !shineRef.current) return
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    ref.current.style.transition = 'transform 0.3s ease'
    shineRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Holographic shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.2s ease', zIndex: 10 }}
      />
    </div>
  )
}
