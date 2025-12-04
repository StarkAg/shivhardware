'use client'

import { useEffect } from 'react'
import { initScroll, destroyScroll } from '@/lib/scroll'

/**
 * Client-only component to initialize Lenis smooth scroll
 * This should be used in the root layout to enable smooth scrolling site-wide
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Initialize Lenis on mount
    initScroll()

    // Cleanup on unmount
    return () => {
      destroyScroll()
    }
  }, [])

  return <>{children}</>
}

