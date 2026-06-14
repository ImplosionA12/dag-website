'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_EXPO } from '@/lib/motion/easing'

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Events',       href: '/events' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Members',      href: '/members' },
  { label: 'Polls',        href: '/polls' },
  { label: 'About',        href: '/about' },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Scroll-driven navbar backdrop — CSS variable, zero re-renders
  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 40 ? '1' : '0'
          navRef.current?.style.setProperty('--nav-scrolled', scrolled)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
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
    const timer = setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    }, 300)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [menuOpen])

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="nav-scrollable fixed left-0 right-0 z-nav flex items-center justify-between px-gutter"
        style={{
          // @ts-expect-error -- CSS custom property
          '--nav-scrolled': '0',
          top: 'var(--ticker-h)',
          height: 'var(--nav-h)',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo — bracketed wordmark */}
        <Link
          href="/"
          aria-label="DAG — Go to home"
          className="nav-logo flex-shrink-0 flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <span
            aria-hidden="true"
            className="type-label"
            style={{ color: 'var(--bracket)', fontSize: '0.9rem', fontWeight: 400 }}
          >
            [
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.7rem',
              fontWeight: 900,
              color: 'var(--text-hi)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            DAG
          </span>
          <span
            aria-hidden="true"
            className="type-label"
            style={{ color: 'var(--bracket)', fontSize: '0.9rem', fontWeight: 400 }}
          >
            ]
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7 list-none" role="list">
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link type-label ${isActive ? 'nav-link-active' : ''}`}
                >
                  <span aria-hidden="true" className="nav-link-index">{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                backgroundColor: 'var(--text-hi)',
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

      {/* Mobile full-screen pause menu */}
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
            className="fixed inset-0 z-menu md:hidden flex flex-col justify-center"
            style={{ backgroundColor: 'rgba(5, 4, 8, 0.98)' }}
          >
            <p
              className="type-label px-8 mb-8"
              style={{ color: 'var(--text-lo)' }}
              aria-hidden="true"
            >
              {'// PAUSE MENU'}
            </p>
            <ul className="flex flex-col gap-1 list-none px-8" role="list">
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: EASE_EXPO }}
                    className="flex items-baseline gap-4"
                  >
                    <span
                      aria-hidden="true"
                      className="type-label"
                      style={{ color: isActive ? 'var(--zone-accent)' : 'var(--text-lo)' }}
                    >
                      {`${String(i + 1).padStart(2, '0')}//`}
                    </span>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.2rem, 9vw, 3.4rem)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        lineHeight: 1.15,
                        color: isActive ? 'var(--zone-accent)' : 'var(--text-hi)',
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
