'use client'

import { ReactNode, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR — lottie-react is client-only
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieSlotProps {
  /** Path to a .json Lottie file in /public, e.g. '/lottie/dag-logo.json'. Null = show fallback. */
  animationPath: string | null
  fallback: ReactNode
  loop?: boolean
  autoplay?: boolean
  className?: string
  width?: number | string
  height?: number | string
}

export function LottieSlot({
  animationPath,
  fallback,
  loop = true,
  autoplay = true,
  className = '',
  width,
  height,
}: LottieSlotProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    if (!animationPath) return

    fetch(animationPath)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => setAnimationData(null))
  }, [animationPath])

  if (!animationPath || !animationData) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
