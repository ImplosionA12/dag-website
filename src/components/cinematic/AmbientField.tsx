/**
 * Zone atmosphere — one continuous violet field behind an entire page.
 *
 * Sections used to each paint their own background gradient, every one
 * swelling to a different mid-tone and resetting to void at its own edges.
 * That made the page read as a stack of separate bands rather than one space.
 * This is the single light source they now all sit inside.
 *
 * Fixed to the viewport on purpose: the light stays put while content scrolls
 * through it, so atmosphere never restarts at a section boundary. Sections are
 * positioned and come later in the DOM, so they paint over this without
 * needing a negative z-index (which stacking contexts would trap).
 *
 * Decorative and static — no pointer or scroll work, nothing to gate.
 */
export function AmbientField() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 95% 55% at 50% -5%, rgba(123,47,190,0.15) 0%, transparent 62%),
          radial-gradient(ellipse 65% 45% at 12% 40%, rgba(74,26,122,0.11) 0%, transparent 66%),
          radial-gradient(ellipse 70% 50% at 88% 88%, rgba(123,47,190,0.10) 0%, transparent 66%),
          var(--void)
        `,
      }}
    />
  )
}
