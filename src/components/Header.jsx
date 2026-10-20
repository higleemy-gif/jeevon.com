import { useEffect, useState } from 'react'
import { BRAND } from '../config/site'
import { MenuIcon, CloseIcon } from './icons'

const NAV_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Sticky site header.
 *
 * Starts transparent over the hero, then picks up a frosted background and a
 * hairline border once the page scrolls — keeps the hero airy without ever
 * losing contrast on the nav text.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu with Escape for keyboard users.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-sand/70 bg-ivory/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Brand */}
        {/* The supplied logo is a stacked lockup, so at header height its
            wordmark would be unreadable. Pair the icon mark with live text
            instead. `mix-blend-multiply` melts the artwork's near-white
            background into the ivory header. */}
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-sm text-ink transition-opacity hover:opacity-80"
        >
          <img
            src="/logo-mark.png"
            alt=""
            width="153"
            height="160"
            className="h-10 w-auto mix-blend-multiply"
          />
          <span className="font-serif text-xl tracking-tight">{BRAND.name}</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-sm py-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-sage-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-700 hover:shadow-lift"
          >
            Join Now
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-cream md:hidden"
        >
          {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-sand/70 bg-ivory/95 backdrop-blur-md md:hidden"
      >
        <nav aria-label="Main" className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-2 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-sage-600 px-5 py-3 text-center text-base font-semibold text-ivory transition-colors hover:bg-sage-700"
          >
            Join Now
          </a>
        </nav>
      </div>
    </header>
  )
}
