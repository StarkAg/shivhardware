'use client'

// Keeps the whole guarantee card on one screen: when it is taller than the window it
// is zoomed down just enough to fit (never below `min`, so the text stays readable; a
// card longer than that scrolls). Zoom rather than transform, so the page height
// shrinks with it. The width is left alone: browsers with standard CSS zoom (Chrome 128+,
// Safari) don't scale percentage widths, so widening it by 1/zoom pushed the card's right
// edge off a phone screen.
import { useLayoutEffect, useRef } from 'react'

export default function FitToScreen({ children, min = 0.72 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      // The keyboard of an open claim form shrinks the window; the card behind it stays put.
      if (document.querySelector('.gc-sheet')) return
      el.style.zoom = ''
      const own = el.getBoundingClientRect().height
      const around = document.documentElement.scrollHeight - own // page padding outside the card
      const room = window.innerHeight - around
      const s = own > room ? Math.max(min, room / own) : 1
      if (s < 1) el.style.zoom = String(s)
    }
    fit()
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    document.fonts?.ready.then(fit)
    for (const img of el.querySelectorAll('img')) if (!img.complete) img.addEventListener('load', fit, { once: true })
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [min])

  return <div ref={ref}>{children}</div>
}
