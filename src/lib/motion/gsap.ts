// Single GSAP entry point. GSAP must NEVER be statically imported anywhere —
// it executes browser code at module scope and breaks `next build` prerender.
// Every cinematic component calls loadGsap() inside a useEffect.

import { getLenis } from './lenis'

type GsapModule = typeof import('gsap')['gsap']
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger')['ScrollTrigger']

let cached: { gsap: GsapModule; ScrollTrigger: ScrollTriggerModule } | null = null
let lenisWired = false

export async function loadGsap(): Promise<{
  gsap: GsapModule
  ScrollTrigger: ScrollTriggerModule
}> {
  if (cached) {
    wireLenis(cached.gsap, cached.ScrollTrigger)
    return cached
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])

  gsap.registerPlugin(ScrollTrigger)
  cached = { gsap, ScrollTrigger }
  wireLenis(gsap, ScrollTrigger)
  return cached
}

// Keep ScrollTrigger in sync with Lenis-driven scrolling — exactly once.
// LenisProvider owns the raf loop; here we only forward scroll updates.
// Lenis may initialize after the first loadGsap() call, so retry on each call.
function wireLenis(_gsap: GsapModule, ScrollTrigger: ScrollTriggerModule): void {
  if (lenisWired) return
  const lenis = getLenis()
  if (!lenis) return

  lenis.on('scroll', ScrollTrigger.update)
  lenisWired = true
}
