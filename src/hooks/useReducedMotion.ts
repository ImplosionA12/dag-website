'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true if the user prefers reduced motion OR is on a mobile-width screen.
 * Use this to decide whether to run heavy animations (Three.js, GSAP stack scroll, etc.)
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isMobile = window.innerWidth < 768

    setReduced(mq.matches || isMobile)

    const handler = () => setReduced(mq.matches || window.innerWidth < 768)
    mq.addEventListener('change', handler)

    const resizeHandler = () => {
      setReduced(mq.matches || window.innerWidth < 768)
    }
    window.addEventListener('resize', resizeHandler)

    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return reduced
}
