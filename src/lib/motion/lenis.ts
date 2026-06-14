// Module-level Lenis singleton holder.
// Lives separately from gsap.ts so the provider and the GSAP loader
// can both reach the instance without a circular import.

import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null): void {
  instance = lenis
}

export function getLenis(): Lenis | null {
  return instance
}
