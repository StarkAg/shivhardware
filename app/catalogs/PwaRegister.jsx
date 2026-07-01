'use client'

import { useEffect } from 'react'

// Registers the catalogue service worker (scoped to /catalogs/) so the section
// is installable as a standalone app.
export default function PwaRegister() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/catalogs/sw.js', { scope: '/catalogs/' }).catch(() => {})
    }
  }, [])
  return null
}
