'use client'

// The card on the door: it turns over from its back to the printed record as the QR
// opens (the "verified" moment, with a short chime where the phone allows sound before
// a tap), then follows the hand: it tilts with the pointer or the phone, eased,
// clamped, and comes back to rest. Without JavaScript, or with reduced motion, the
// card simply lies face up; nothing waits on it.
import { useEffect, useLayoutEffect, useRef } from 'react'

const TURN_MS = 1350 // the turn (globals in page.jsx: .gc-card animation) and its landing

function chime(ctx) {
  const now = ctx.currentTime + 0.02
  const out = ctx.createGain()
  out.gain.value = 0.22
  out.connect(ctx.destination)
  // Two rising notes with a soft bell overtone, like a payment-success sound.
  for (const [freq, at] of [[1046.5, 0], [1568, 0.13]]) {
    for (const [mult, level] of [[1, 1], [2, 0.18]]) {
      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * mult
      env.gain.setValueAtTime(0.0001, now + at)
      env.gain.exponentialRampToValueAtTime(level, now + at + 0.012)
      env.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.55)
      osc.connect(env).connect(out)
      osc.start(now + at)
      osc.stop(now + at + 0.6)
    }
  }
}

// One line for the name and for each item: the type comes down until the longest fits
// (every item row to the same size, so the column stays even) rather than breaking a
// size over two lines. Only past the smallest size that still reads does a line wrap.
const FIT = [['.gc-front h1', 20], ['.gc-items .spec', 14]]
function fitLines(card) {
  for (const [sel, min] of FIT) {
    const els = [...card.querySelectorAll(sel)]
    if (!els.length) continue
    for (const el of els) el.style.fontSize = el.style.whiteSpace = ''
    const over = () => els.filter((el) => el.scrollWidth > el.clientWidth)
    let size = parseFloat(getComputedStyle(els[0]).fontSize)
    const ratio = Math.min(...els.map((el) => el.clientWidth / Math.max(el.scrollWidth, 1)))
    if (ratio >= 1) continue
    size = Math.max(min, Math.floor(size * ratio * 2) / 2)
    for (const el of els) el.style.fontSize = `${size}px`
    while (size > min && over().length) {
      size -= 0.5
      for (const el of els) el.style.fontSize = `${size}px`
    }
    for (const el of over()) el.style.whiteSpace = 'normal'
  }
}

// A weak phone (little memory or few cores) or one saving data: the card keeps its
// turn but lies still after it, without the tilt and sheen that redraw it on every move
// of the hand (page.jsx: .gc-lite).
function weakDevice() {
  const n = navigator
  return n.connection?.saveData === true || n.deviceMemory <= 2 || n.hardwareConcurrency <= 2 ||
    (n.deviceMemory <= 4 && n.hardwareConcurrency <= 4)
}

// `rows`: the card's item rows. A card lies a little askew on the wood, less the longer
// it is, or a full one (18 rows) would lean off the screen.
export default function CardStage({ label, rows = 1, children }) {
  const card = useRef(null)

  // One screen when the card allows it: on a phone the card takes the room left by the
  // years, the button and the terms, as near the card's own 54 x 86 shape as that room
  // allows, and grows past it (the page scrolls) only when its rows need more. Measured
  // once the fonts are in, again when the phone turns; not on every address-bar resize.
  useLayoutEffect(() => {
    const el = card.current
    const door = el.closest('.gc-door')
    if (weakDevice()) el.closest('.gc-page')?.classList.add('gc-lite')
    let width = 0
    const fit = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      el.style.width = el.style.minHeight = el.style.aspectRatio = ''
      if (width >= 860) return fitLines(el) // a computer: the card sits beside the claim (page.jsx)
      const widest = Math.min(width * 0.84, 330)
      el.style.aspectRatio = 'auto'
      el.style.width = `${widest}px`
      fitLines(el)
      door.style.minHeight = '0px'
      const room = window.innerHeight - (document.documentElement.scrollHeight - el.offsetHeight)
      const w = Math.max(Math.min(widest, room * 54 / 86), Math.min(250, widest))
      el.style.width = `${w}px`
      if (w < widest) fitLines(el)
      el.style.minHeight = `${Math.max(el.offsetHeight, Math.min(room, w * 86 / 54))}px`
      door.style.minHeight = ''
    }
    const refit = () => { width = 0; fit() }
    fit()
    document.fonts?.ready.then(refit)
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', refit)
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', refit)
    }
  }, [])

  useEffect(() => {
    const el = card.current
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // The turn, the stencil and the seal are CSS, running from the first paint (page.jsx),
    // so the card never shows face up and then flips back to start.

    let ctx = null
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) { ctx = new AC(); ctx.resume?.().catch(() => {}) }
    } catch { /* no audio on this device */ }
    const landed = setTimeout(() => {
      if (ctx && ctx.state === 'running') chime(ctx)
    }, still ? 50 : TURN_MS)

    if (still || weakDevice()) return () => { clearTimeout(landed); ctx?.close?.().catch(() => {}) }

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0
    const frame = () => {
      x += (tx - x) * 0.1
      y += (ty - y) * 0.1
      el.style.setProperty('--ry', `${x.toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-y).toFixed(2)}deg`)
      el.style.setProperty('--shine', `${(x * 2).toFixed(1)}%`)
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(frame) : 0
    }
    const aim = (nx, ny) => {
      const ax = Math.max(-10, Math.min(10, nx * 10))
      const ay = Math.max(-8, Math.min(8, ny * 8))
      // A phone held still still trembles a little: under half a degree, nothing redraws.
      if (Math.abs(ax - tx) + Math.abs(ay - ty) < 0.5) return
      tx = ax
      ty = ay
      if (!raf) raf = requestAnimationFrame(frame)
    }
    // The turn owns the transform until it ends; the tilt takes over after.
    const turned = (e) => { if (e.target === el && e.animationName.endsWith('gc-turn')) el.classList.add('is-turned') }
    const onMove = (e) => aim(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * 2 - 1)
    const onLeave = () => aim(0, 0)
    const onTilt = (e) => { if (e.gamma != null) aim(e.gamma / 30, (e.beta - 45) / 30) }
    el.addEventListener('animationend', turned)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('deviceorientation', onTilt)
    return () => {
      clearTimeout(landed)
      ctx?.close?.().catch(() => {})
      cancelAnimationFrame(raf)
      el.removeEventListener('animationend', turned)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  return (
    <div className="gc-stage">
      <article ref={card} className="gc-card" aria-label={label} style={{ '--lean': `${-Math.max(0.6, 2.5 - Math.max(0, rows - 3) * 0.25).toFixed(2)}deg` }}>
        <div className="gc-face gc-back" aria-hidden="true" />
        {children}
      </article>
    </div>
  )
}
