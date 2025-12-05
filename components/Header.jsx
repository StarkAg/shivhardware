'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/collections', label: 'Collections' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-30',
        'transition-all duration-300',
        // Very light, glassy header that lets background show through
        'backdrop-blur-xl bg-black/10 border-b border-white/10',
      ].join(' ')}
      aria-label="Main navigation"
    >
      <div className="w-full px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 flex items-center justify-between gap-6 relative">
        {/* Logo - Shiv Hardware Store */}
        <Link href="/" className="flex items-center hover-scale gap-3 absolute left-3 sm:left-5 md:left-8" aria-label="Shiv Hardware Store home">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              src="/White Logo.png"
              alt="Shiv Hardware Store logo"
              fill
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <span className="hidden sm:block text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Shiv Hardware
          </span>
        </Link>

        {/* Page Title - Centered (for aluminium-door page) */}
        {pathname === '/aluminium-door' && (
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">
              Aluminium Door
            </h1>
            <p className="text-xs sm:text-sm text-white/80">
              We Provide a Smart Price Calculator for Your Needs
            </p>
          </div>
        )}

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm ml-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'relative text-white/80 hover:text-white transition-colors duration-200',
                  'after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200',
                  active ? 'text-white after:w-full' : 'after:w-0 hover:after:w-full',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
