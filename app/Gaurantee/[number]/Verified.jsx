'use client'

// The "Guarantee Card Verified" moment shown over the card when its QR opens: a shield
// emblem, then a brass tick badge pops onto its corner with a short chime (only where
// the phone allows sound before a tap), and the screen moves on to the card by itself.
import { useEffect, useState } from 'react'

const TICK_DONE_MS = 700
const AUTO_CLOSE_MS = 1500
const LEAVE_MS = 300

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

export default function Verified({ number }) {
  const [phase, setPhase] = useState('in') // in -> leaving -> gone

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let ctx = null
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) {
        ctx = new AC()
        ctx.resume?.().catch(() => {})
      }
    } catch { /* no audio on this device */ }

    const timers = []
    timers.push(setTimeout(() => {
      if (ctx && ctx.state === 'running') chime(ctx)
      navigator.vibrate?.(40)
      timers.push(setTimeout(() => setPhase('leaving'), AUTO_CLOSE_MS - TICK_DONE_MS))
    }, reduce ? 50 : TICK_DONE_MS))
    return () => {
      timers.forEach(clearTimeout)
      ctx?.close?.().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return
    // The card's guarantee stamp lands as this screen clears (see .gc-revealed).
    document.documentElement.classList.add('gc-revealed')
    const t = setTimeout(() => setPhase('gone'), LEAVE_MS)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null
  return (
    <div className={`gc-verify${phase === 'leaving' ? ' is-leaving' : ''}`} role="status" aria-live="polite" onClick={() => setPhase('leaving')}>
      <div className="gc-verify-inner">
        <div className="gc-mark">
          <span className="gc-ripple" aria-hidden="true" />
          <span className="gc-logo-tile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.5c2.2 1.7 4.9 2.6 7.5 2.6v5.6c0 4.9-3.2 8.4-7.5 9.8-4.3-1.4-7.5-4.9-7.5-9.8V5.1c2.6 0 5.3-.9 7.5-2.6z" />
            </svg>
          </span>
          <svg className="gc-tick" viewBox="0 0 48 48" aria-hidden="true">
            <circle className="disc" cx="24" cy="24" r="22.5" />
            <path className="mark" d="M14.5 24.5 21 31 33.5 17.5" />
          </svg>
        </div>
        <div className="gc-verify-title">Guarantee Card Verified</div>
        <div className="gc-verify-sub">{number}</div>
      </div>
    </div>
  )
}
