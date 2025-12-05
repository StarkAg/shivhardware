'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // TODO: Add newsletter subscription logic
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--muted)]/20 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--fg)]">Shiv Hardware Store</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Shiv Hardware Store™ is your trusted source for premium building materials and hardware solutions.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 flex items-center justify-center transition-colors text-[var(--fg)]"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 flex items-center justify-center transition-colors text-[var(--fg)]"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 flex items-center justify-center transition-colors text-[var(--fg)]"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--fg)]">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>FAQ&apos;s</span>
                </Link>
              </li>
              <li>
                <Link href="/dealer-locator" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Dealer Locator</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--fg)]">Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/refund-policy" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-2">
                  <span className="text-[var(--muted)]/60">&gt;</span>
                  <span>Shipping Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--fg)]">Contact Information</h3>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>
                <span className="font-medium text-[var(--fg)]">Email:</span>{' '}
                <a href="mailto:info@shivhardware.com" className="hover:text-[var(--fg)] transition-colors">
                  info@shivhardware.com
                </a>
              </p>
              <p>
                <span className="font-medium text-[var(--fg)]">Phone:</span>{' '}
                <a href="tel:+918092850954" className="hover:text-[var(--fg)] transition-colors">
                  080928 50954
                </a>
              </p>
              <p className="leading-relaxed">
                <span className="font-medium text-[var(--fg)]">Address:</span>{' '}
                Ramgarh Cantonment, Ramgarh, Jharkhand, India
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium text-[var(--fg)]">Hours:</span>{' '}
                <span className="text-[var(--muted)]">10:30 AM - 7:00 PM (Closed Tuesdays)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-[var(--muted)]/20 pt-8 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-bold mb-2 text-[var(--fg)]">Get Updates</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              Get a first peek at New Products, Special Offers, and so much more.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--muted)]/10 border border-[var(--muted)]/20 text-[var(--fg)] placeholder-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-lg hover:bg-[var(--fg)] transition-colors font-medium"
                aria-label="Subscribe to newsletter"
              >
                →
              </button>
            </form>
            {subscribed && (
              <p className="mt-4 text-sm text-[var(--muted)]">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--muted)]/20 bg-[var(--muted)]/5 py-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--muted)]">
            <p>© 2025, Shiv Hardware Store. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <Link href="/refund-policy" className="hover:text-[var(--fg)] transition-colors">
                Refund policy
              </Link>
              <span className="text-[var(--muted)]/50">•</span>
              <Link href="/privacy-policy" className="hover:text-[var(--fg)] transition-colors">
                Privacy policy
              </Link>
              <span className="text-[var(--muted)]/50">•</span>
              <Link href="/terms-of-service" className="hover:text-[var(--fg)] transition-colors">
                Terms of service
              </Link>
              <span className="text-[var(--muted)]/50">•</span>
              <Link href="/shipping-policy" className="hover:text-[var(--fg)] transition-colors">
                Shipping policy
              </Link>
              <span className="text-[var(--muted)]/50">•</span>
              <Link href="/contact" className="hover:text-[var(--fg)] transition-colors">
                Contact information
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

