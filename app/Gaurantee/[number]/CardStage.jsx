'use client'

// The card on the door: it turns over from its back to the printed record as the QR
// opens (the "verified" moment, with a short chime where the phone allows sound before
// a tap), then follows the hand: it tilts with the pointer or the phone, eased,
// clamped, and comes back to rest. Without JavaScript, or with reduced motion, the
// card simply lies face up; nothing waits on it.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
// (every item row to the same size, so the columns stay even) rather than breaking a
// size over two lines. Only past the smallest size that still reads does a line wrap.
const FIT = [['.gc-front h1', 20], ['.gc-rows', 14]]
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

// A weak phone (little memory, as Android's Chrome reports it) or one saving data: the card keeps its
// turn but lies still after it, without the tilt and sheen that redraw it on every move
// of the hand (page.jsx: .gc-lite).
function weakDevice() {
  const n = navigator
  return n.connection?.saveData === true || n.deviceMemory <= 2 ||
    (n.deviceMemory <= 4 && n.hardwareConcurrency <= 4)
}

// An iPhone sends a page the phone's tilt only once the person allows it, and only a tap
// can ask; there the card offers a button for it (below the card, until answered).
// Chrome has the same request but sends the tilt without it, so only Apple's phones and
// tablets ask (an iPad's Safari calls itself a Mac with a touch screen).
function asksForTilt() {
  const n = navigator
  const apple = /iPhone|iPad|iPod/.test(n.userAgent) || (n.platform === 'MacIntel' && n.maxTouchPoints > 1)
  return apple && typeof window.DeviceOrientationEvent?.requestPermission === 'function' &&
    !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && !weakDevice()
}

// The card lies square on the wood: a lean would slant its item columns, the pieces of
// a lower row standing to the right of those above.
export default function CardStage({ label, children }) {
  const card = useRef(null)
  const refit = useRef(null)
  const askTilt = useRef(null)
  const [offerTilt, setOfferTilt] = useState(false)

  // One screen when the card allows it: on a phone the card takes the room left by the
  // years, the button and the terms, as near the card's own 54 x 86 shape as that room
  // allows, and grows past it (the page scrolls) only when its rows need more. Measured
  // once the fonts are in, again when the phone turns; not on every address-bar resize.
  useLayoutEffect(() => {
    const el = card.current
    const door = el.closest('.gc-door')
    if (weakDevice()) el.closest('.gc-page')?.classList.add('gc-lite')
    // Before the first paint, so the card is sized with the tilt button under it.
    if (asksForTilt()) setOfferTilt(true)
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
    const refitNow = () => { width = 0; fit() }
    refit.current = refitNow
    fit()
    document.fonts?.ready.then(refitNow)
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', refitNow)
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', refitNow)
    }
  }, [])

  // The tilt button takes room under the card: size the card again when it comes in
  // (not when it goes, so the card does not jump once the question is answered).
  useLayoutEffect(() => { if (offerTilt) refit.current?.() }, [offerTilt])

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
    // An iPhone asks from the tilt button, or from the first tap on the card or the wood
    // (not another button, a link or the claim form).
    const request = () => {
      document.removeEventListener('touchend', ask)
      document.removeEventListener('click', ask)
      askTilt.current = null
      setOfferTilt(false)
      window.DeviceOrientationEvent.requestPermission()
        .then((answer) => { if (answer === 'granted') window.addEventListener('deviceorientation', onTilt) })
        .catch(() => {})
    }
    const ask = (e) => {
      if (!e.target.closest?.('button, a, input, textarea, select, label, .gc-sheet-backdrop')) request()
    }
    if (asksForTilt()) {
      askTilt.current = request
      document.addEventListener('touchend', ask)
      document.addEventListener('click', ask)
    } else {
      window.addEventListener('deviceorientation', onTilt)
    }
    return () => {
      askTilt.current = null
      clearTimeout(landed)
      ctx?.close?.().catch(() => {})
      cancelAnimationFrame(raf)
      el.removeEventListener('animationend', turned)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('touchend', ask)
      document.removeEventListener('click', ask)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  return (
    <div className="gc-stage">
      <article ref={card} className="gc-card" aria-label={label}>
        <div className="gc-face gc-back" aria-hidden="true" />
        {children}
      </article>
      {offerTilt ? (
        <button type="button" className="gc-tilt" onClick={() => askTilt.current?.()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="8" y="3" width="8" height="18" rx="2" transform="rotate(-14 12 12)" />
            <path d="M3.5 9.5A9 9 0 0 1 6.5 4.5M20.5 14.5a9 9 0 0 1-3 5" />
          </svg>
          Move the card with your phone
        </button>
      ) : null}
    </div>
  )
}
