'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleCollectionsClick = (e) => {
    setMenuOpen(false)
    if (pathname === '/') {
      e.preventDefault()
      setTimeout(() => {
        const collectionsSection = document.getElementById('collections')
        if (collectionsSection) {
          if (typeof window !== 'undefined' && window.__lenis) {
            window.__lenis.scrollTo(collectionsSection, { offset: -80, duration: 1.2 })
          } else {
            collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => { window.scrollBy(0, -80) }, 100)
          }
        }
      }, 50)
    } else {
      e.preventDefault()
      router.push('/#collections')
      setTimeout(() => {
        const collectionsSection = document.getElementById('collections')
        if (collectionsSection) {
          if (typeof window !== 'undefined' && window.__lenis) {
            window.__lenis.scrollTo(collectionsSection, { offset: -80, duration: 1.2 })
          } else {
            collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => { window.scrollBy(0, -80) }, 100)
          }
        }
      }, 300)
    }
  }

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-30',
          'transition-all duration-300',
          isDark
            ? 'backdrop-blur-xl bg-black/10 border-b border-white/10'
            : 'backdrop-blur-xl bg-white/80 border-b border-black/10',
        ].join(' ')}
        aria-label="Main navigation"
      >
        <div className="w-full px-3 sm:px-5 md:px-8 py-3 sm:py-4 flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover-scale"
            aria-label="Shiv Hardware Store home"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
              <Image
                src="/White Logo.png"
                alt="Shiv Hardware Store logo"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <span className={`hidden sm:block text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>
              Shiv Hardware
            </span>
          </Link>

          {/* Page Title - Centered (calculator pages) */}
          {pathname === '/aluminium-door' && (
            <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <h1 className={`text-base sm:text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Aluminium Door
              </h1>
            </div>
          )}
          {pathname === '/window-2track' && (
            <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <h1 className={`text-base sm:text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Window Calculator
              </h1>
            </div>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm ml-auto">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href === '/#collections' && pathname === '/')
              const isCollections = item.href === '/#collections'
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isCollections ? handleCollectionsClick : undefined}
                  className={[
                    'relative transition-colors duration-200',
                    isDark
                      ? active ? 'text-white' : 'text-white/80 hover:text-white'
                      : active ? 'text-black' : 'text-black/80 hover:text-black',
                    'after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:transition-all after:duration-200',
                    isDark ? 'after:bg-white' : 'after:bg-black',
                    active ? 'after:w-full' : 'after:w-0 hover:after:w-full',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-200 hover-scale ${
                isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
              }`}
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded flex items-center justify-center transition-all duration-300 hover-scale ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                  : 'bg-black/10 hover:bg-black/20 border border-black/20'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Right Side: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            {/* Cart */}
            <Link
              href="/cart"
              className={`w-11 h-11 flex items-center justify-center rounded transition-colors ${
                isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
              }`}
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded transition-colors ${
                isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-black hover:bg-black/10'
              }`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-20 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${isDark ? 'bg-black/95' : 'bg-white/97'} backdrop-blur-xl`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href === '/#collections' && pathname === '/')
            const isCollections = item.href === '/#collections'
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isCollections ? handleCollectionsClick : () => setMenuOpen(false)}
                className={[
                  'text-3xl font-semibold tracking-wide transition-colors duration-200',
                  isDark
                    ? active ? 'text-white' : 'text-white/60 hover:text-white'
                    : active ? 'text-black' : 'text-black/50 hover:text-black',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Divider */}
          <div className={`w-16 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

          {/* Theme Toggle in mobile menu */}
          <button
            onClick={() => { toggleTheme(); setMenuOpen(false) }}
            className={`flex items-center gap-3 text-lg transition-colors ${
              isDark ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light Mode
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Mode
              </>
            )}
          </button>
        </nav>
      </div>
    </>
  )
}
