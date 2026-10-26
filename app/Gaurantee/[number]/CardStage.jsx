'use client'

// The card on the door: it turns over from its back to the printed record as the QR
// opens (the "verified" moment, with a short chime where the phone allows sound before
// a tap), then follows the hand: it tilts with the pointer or the phone, eased,
// clamped, and comes back to rest. Without JavaScript, or with reduced motion, the
// card simply lies face up; nothing waits on it.
import { useEffect, useRef } from 'react'

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

export default function CardStage({ label, children }) {
  const card = useRef(null)

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

    if (still) return () => { clearTimeout(landed); ctx?.close?.().catch(() => {}) }

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0
    const frame = () => {
      x += (tx - x) * 0.1
      y += (ty - y) * 0.1
      el.style.setProperty('--ry', `${x.toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-y).toFixed(2)}deg`)
      el.style.setProperty('--shine', `${(x * 2).toFixed(1)}%`)
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.02 ? requestAnimationFrame(frame) : 0
    }
    const aim = (nx, ny) => {
      tx = Math.max(-10, Math.min(10, nx * 10))
      ty = Math.max(-8, Math.min(8, ny * 8))
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
      <article ref={card} className="gc-card" aria-label={label}>
        <div className="gc-face gc-back" aria-hidden="true" />
        {children}
      </article>
    </div>
  )
}
