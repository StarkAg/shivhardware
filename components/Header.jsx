'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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

  const handleCollectionsClick = (e) => {
    if (pathname === '/') {
      e.preventDefault()
      setTimeout(() => {
        const collectionsSection = document.getElementById('collections')
        if (collectionsSection) {
          // Use Lenis smooth scroll if available
          if (typeof window !== 'undefined' && window.__lenis) {
            window.__lenis.scrollTo(collectionsSection, {
              offset: -80, // Offset for fixed header
              duration: 1.2,
            })
          } else {
            // Fallback to native smooth scroll
            collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => {
              window.scrollBy(0, -80) // Offset for fixed header
            }, 100)
          }
        }
      }, 50)
    } else {
      // If not on home page, navigate first, then scroll after page loads
      e.preventDefault()
      router.push('/#collections')
      // Scroll will happen after navigation via hash change
      setTimeout(() => {
        const collectionsSection = document.getElementById('collections')
        if (collectionsSection) {
          if (typeof window !== 'undefined' && window.__lenis) {
            window.__lenis.scrollTo(collectionsSection, {
              offset: -80,
              duration: 1.2,
            })
          } else {
            collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => {
              window.scrollBy(0, -80)
            }, 100)
          }
        }
      }, 300)
    }
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-30',
        'transition-all duration-300',
        // Very light, glassy header that lets background show through
        theme === 'dark' 
          ? 'backdrop-blur-xl bg-black/10 border-b border-white/10'
          : 'backdrop-blur-xl bg-white/80 border-b border-black/10',
      ].join(' ')}
      aria-label="Main navigation"
    >
      <div className="w-full px-3 sm:px-5 md:px-8 py-3 sm:py-4 md:py-4 flex items-center justify-between gap-6 relative">
        {/* Logo - Shiv Hardware Store */}
        <Link href="/" className="flex items-center hover-scale gap-3 absolute left-3 sm:left-5 md:left-8" aria-label="Shiv Hardware Store home">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11">
            <Image
              src="/White Logo.png"
              alt="Shiv Hardware Store logo"
              fill
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <span className={`hidden sm:block text-xs font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Shiv Hardware
          </span>
        </Link>

        {/* Page Title - Centered (for aluminium-door and window pages) */}
        {pathname === '/aluminium-door' && (
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Aluminium Door
            </h1>
          </div>
        )}
        {pathname === '/window-2track' && (
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Window Calculator
            </h1>
          </div>
        )}

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm ml-auto">
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
                  theme === 'dark'
                    ? active 
                      ? 'text-white' 
                      : 'text-white/80 hover:text-white'
                    : active
                      ? 'text-black'
                      : 'text-black/80 hover:text-black',
                  `after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:transition-all after:duration-200`,
                  theme === 'dark' 
                    ? 'after:bg-white' 
                    : 'after:bg-black',
                  active ? 'after:w-full' : 'after:w-0 hover:after:w-full',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded flex items-center justify-center transition-all duration-300 hover-scale ml-4 ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 border border-white/20'
              : 'bg-black/10 hover:bg-black/20 border border-black/20'
          }`}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? (
            // Sun icon for light mode
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
