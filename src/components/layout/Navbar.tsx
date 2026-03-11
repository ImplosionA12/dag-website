'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Events',       href: '/events' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Members',      href: '/members' },
  { label: 'About',        href: '/about' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Increase opacity as user scrolls
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Escape to close + focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !menuRef.current) return

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Focus first link after animation starts
    const timer = setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    }, 300)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [menuOpen])

  const bgOpacity = scrolled ? 0.92 : 0.6

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="fixed left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10"
        style={{
          top: 'var(--ticker-height)',
          height: 'var(--navbar-height)',
          background: `rgba(10, 8, 18, ${bgOpacity})`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(157, 78, 221, 0.1)',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="DAG — Go to home"
          className="flex-shrink-0"
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--violet-bright)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 0.1s ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-core)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--violet-bright)'
          }}
        >
          DAG
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 list-none" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative text-label transition-colors duration-150"
                  style={{
                    color: isActive ? 'var(--violet-bright)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    paddingBottom: '4px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--violet-bright)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '2px',
                        background: 'var(--gold-core)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                backgroundColor: 'var(--text-primary)',
                borderRadius: '1px',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen
                  ? i === 0 ? 'translateY(8px) rotate(45deg)'
                  : i === 2 ? 'translateY(-8px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 md:hidden flex flex-col justify-center items-center"
            style={{
              backgroundColor: 'rgba(6, 5, 10, 0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <ul className="flex flex-col items-center gap-8 list-none p-8" role="list">
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                  >
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        fontFamily: 'var(--font-rajdhani)',
                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: isActive ? 'var(--violet-bright)' : 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {label}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
