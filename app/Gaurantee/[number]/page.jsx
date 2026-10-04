// Public guarantee-card view. This is the target of the QR printed on Shiv
// Hardware guarantee cards: https://www.shivhardware.store/Gaurantee/GC-2026-XXXX
// It fetches the card from Convex and shows a clean, mobile-first summary
// (customer, Aadhaar, phone, guaranteed items). Rendered per-request so newly
// printed cards resolve immediately, with no rebuild.

import { cache } from 'react'
import Verified from './Verified'
import FitToScreen from './FitToScreen'
import CardActions from './CardActions'

export const dynamic = 'force-dynamic'

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://sensible-panther-176.convex.cloud'

// The QR is .../Gaurantee/<number>?k=<token>. Convex only opens a card when the
// number AND its secret token match (cards carry Aadhaar + mobile, and numbers
// are sequential), so the token must be passed through — without it every scan
// is "Card not found". One QR, one card.
// Once per request: the page and its tab title both need the card.
const getGuarantee = cache(loadGuarantee)

async function loadGuarantee(number, token) {
  if (!token) return null
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'documents:getGuaranteeByNumber',
        args: { number, token },
        format: 'json',
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json()
    if (json.status !== 'success' || !json.value) return null
    const v = json.value
    // Convex stores the full payload under `document`; flatten it up.
    return v.document && typeof v.document === 'object' ? { ...v, ...v.document } : v
  } catch {
    return null
  }
}

// The card holder's claims and their status (convex/guaranteeClaims.ts, same gate as the card).
async function getClaims(number, token) {
  if (!token) return []
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'guaranteeClaims:forCard', args: { number, token }, format: 'json' }),
      cache: 'no-store',
    })
    const json = await res.json()
    return json.status === 'success' && Array.isArray(json.value) ? json.value : []
  } catch {
    return []
  }
}
const CLAIM_STATUS = { new: 'Received', reviewing: 'Under review', approved: 'Approved', rejected: 'Not approved', replaced: 'Replaced' }
const CLAIM_ISSUE = { borer: 'Borer', air: 'Air bubbles', cracks: 'Cracks' }

// Sizes are inches + eighths (soot). Eighths print as their fraction glyph: 44 4/8" -> 44½″.
const EIGHTHS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞']
const NBSP = ' '
function fmtDim(d) {
  if (!d || (!d.inches && !d.soot)) return ''
  const soot = Number(d.soot) || 0
  const frac = soot > 0 && soot < 8 ? EIGHTHS[soot] : ''
  return `${d.inches || (frac ? '' : 0)}${frac}″`
}
/** An item's size as the bill wrote it ("7 X 4" feet) when the card carries one, else its inches. */
function itemSize(it) {
  return (it.sizeLabel && String(it.sizeLabel).trim()) || fmtSize(it.height, it.width)
}
function fmtSize(h, w) {
  const a = fmtDim(h)
  const b = fmtDim(w)
  return a && b ? `${a}${NBSP}×${NBSP}${b}` : a || b || ''
}
// "19MM" -> "19 mm"; anything else is shown as typed.
function fmtThickness(t) {
  const s = String(t || '').trim()
  const m = s.match(/^(\d+(?:\.\d+)?)\s*mm$/i)
  return m ? `${m[1]}${NBSP}mm` : s
}
// The shop's wax seals (Shiv_Panel/assets/seals). One goes on the card by the total,
// stamped at the angle a hand would leave it. The angle comes from the card number,
// so a card looks the same every time it is opened.
const SEAL_YEARS = [1, 3, 7, 10, 25]
function stampPose(seed) {
  // -span/2 .. +span/2, from its own FNV-1a hash per value so they vary independently.
  const pick = (salt, span) => {
    let h = 2166136261
    for (const c of `${seed}|${salt}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    return (h % 1000) / 1000 * span - span / 2
  }
  const turn = pick('turn', 40)
  return {
    turn: Math.abs(turn) < 6 ? turn + Math.sign(turn || 1) * 6 : turn, // never almost straight
    x: Math.round(pick('x', 12)),
    y: Math.round(pick('y', 8)),
  }
}
function Stamp({ years, seed }) {
  if (!years) return null
  const { turn, x, y } = stampPose(seed)
  const style = { '--turn': `${turn.toFixed(1)}deg`, '--dx': `${x}px`, '--dy': `${y}px` }
  const label = `${years} year guarantee against borer`
  return SEAL_YEARS.includes(years)
    ? <img className="gc-stamp" style={style} src={`/assets/guarantee/seal-${years}yr.png`} alt={label} width="220" height="220" />
    : <span className="gc-stamp gc-stamp-ink" style={style} role="img" aria-label={label}><b>{years}</b>{years === 1 ? 'YEAR' : 'YEARS'}<small>GUARANTEE</small></span>
}
const rupees = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`

/**
 * A card shows Shiv Hardware's name and logo for its first 10 days, counted from
 * its own date, and is neutral after that (no seller named anywhere, below).
 */
const BRANDED_DAYS = 10
function isBranded(doc) {
  const issued = Date.parse(doc?.date ?? '') || Number(doc?.createdAt) || 0
  return issued > 0 && Date.now() - issued < BRANDED_DAYS * 24 * 60 * 60 * 1000
}

// Neutral, nothing here names the seller: the site-wide title, description, author,
// social preview, canonical link and icon are all replaced for this page. A card in
// its first 10 days carries the shop's name and icon instead.
export async function generateMetadata({ params, searchParams }) {
  const { number } = await params
  const { k } = (await searchParams) ?? {}
  const doc = await getGuarantee(number, typeof k === 'string' ? k.trim() : '')
  const branded = isBranded(doc)
  const title = branded ? `Guarantee Card ${number} — Shiv Hardware Store` : `Guarantee Card ${number}`
  const description = branded ? 'Shiv Hardware Store guarantee card.' : 'Online guarantee card record.'
  return {
    title,
    description,
    keywords: null,
    authors: null,
    creator: null,
    publisher: null,
    openGraph: { type: 'website', title, description },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: null },
    icons: branded
      ? { icon: { url: '/assets/Favicon.png', type: 'image/png' } }
      : { icon: { url: '/assets/guarantee/shield.svg', type: 'image/svg+xml' } },
    robots: { index: false, follow: false },
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8e5df' },
    { media: '(prefers-color-scheme: dark)', color: '#12110f' },
  ],
}

const styles = `
  /* The attendance app's palette. Also set on the sheet layer, which is portalled to
     <body> outside .gc-page and would otherwise miss every colour. */
  .gc-page, .gc-sheet-backdrop {
    --bg: #e8e5df; --card: #f3f0ea; --card2: #ede9e1; --fg: #1c1917; --muted: #78716c;
    --line: rgba(28, 25, 23, .12); --brass: #b9924b; --brass-ink: #201804; --brass-text: #7d5f22;
    --red: #9f1d20; --lift: 0 10px 30px rgba(28, 25, 23, .14);
    --ok: #146239; --ok-bg: #e3f1e8; --bad: #9f1d20; --bad-bg: #f6e3e3;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    .gc-page, .gc-sheet-backdrop {
      --bg: #12110f; --card: #1a1815; --card2: #211e1a; --fg: #eae7e1; --muted: #a8a29e;
      --line: rgba(255, 255, 255, .10); --brass: #c9a45c; --brass-ink: #1a1204; --brass-text: #c9a45c;
      --red: #d3595c; --lift: 0 10px 34px rgba(0, 0, 0, .44);
      --ok: #4cb782; --ok-bg: rgba(76, 183, 130, .16); --bad: #d3595c; --bad-bg: rgba(211, 89, 92, .16);
      color-scheme: dark;
    }
    .gc-page { background: linear-gradient(180deg, #12110f 0%, #1a1815 54%, #100f0e 100%); }
  }
  .gc-page, .gc-sheet-backdrop { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
  .gc-page button, .gc-page a, .gc-sheet-backdrop button, .gc-sheet-backdrop label { touch-action: manipulation; }
  .gc-page {
    overflow-x: clip;
    min-height: 100vh; min-height: 100dvh; background: var(--bg); color: var(--fg);
    font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }
  body:has(.gc-page) { margin: 0; background: #e8e5df; }
  @media (prefers-color-scheme: dark) { body:has(.gc-page) { background: #12110f; } }
  .gc-wrap { max-width: 620px; margin: 0 auto; padding: 0 calc(12px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left)); }

  .gc-head { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 10px; margin: 0 -12px 10px;
    padding: calc(9px + env(safe-area-inset-top)) calc(14px + env(safe-area-inset-right)) 9px calc(14px + env(safe-area-inset-left));
    background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line); }
  .gc-logo { width: 36px; height: 36px; flex: none; border-radius: 10px; background: var(--brass); color: var(--brass-ink); padding: 6px; box-shadow: 0 1px 3px rgba(0,0,0,.18); }
  .gc-logo svg { width: 100%; height: 100%; display: block; }
  .gc-logo.is-brand { background: #fff; padding: 4px; }
  .gc-logo img, .gc-logo-tile img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .gc-brand { flex: 1; min-width: 0; font-size: 17px; font-weight: 800; line-height: 1.1; letter-spacing: .01em; }
  .gc-brand small { display: block; margin-top: 3px; font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .14em; }
  .gc-head-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .gc-tag { color: var(--fg); font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; white-space: nowrap; }
  .gc-verified { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px 2px 6px; border-radius: 999px;
    background: var(--brass); color: var(--brass-ink); font-size: 11px; font-weight: 800; letter-spacing: .02em; }
  .gc-verified svg { width: 12px; height: 12px; }

  .gc-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--lift); padding: 11px 14px; margin-bottom: 10px; }
  .gc-card h2 { margin: 0 0 4px; font-size: 10.5px; text-transform: uppercase; letter-spacing: .14em; color: var(--brass-text); font-weight: 800; }
  .gc-name { font-size: 18px; font-weight: 800; line-height: 1.2; }
  .gc-facts { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--line); }
  .gc-fact .k { display: block; font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .12em; font-weight: 700; }
  .gc-fact .v { display: block; margin-top: 2px; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .gc-fact .v a { color: inherit; text-decoration: none; }

  .gc-item { padding: 7px 0; border-top: 1px solid var(--line); }
  .gc-card h2 + .gc-item { border-top: 0; padding-top: 3px; }
  .gc-item-body { min-width: 0; }
  .gc-item-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .gc-item-top .brand { font-weight: 700; font-size: 14.5px; line-height: 1.25; min-width: 0; overflow-wrap: anywhere; }
  .gc-amt { font-weight: 800; font-size: 14.5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .gc-item-bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 10px; margin-top: 2px; }
  .gc-spec { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; letter-spacing: .01em; }
  .gc-spec .dot { opacity: .55; margin: 0 5px; }
  .gc-qty { margin-left: auto; font-size: 11.5px; font-weight: 700; color: var(--fg); background: var(--card2); border: 1px solid var(--line);
    padding: 1px 8px; border-radius: 999px; white-space: nowrap; font-variant-numeric: tabular-nums; }

  /* Total block: the seal pressed on its left, the sum on its right, so it sits by the
     total without covering anything and without adding a strip of its own. */
  .gc-total { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 4px; padding-top: 6px; border-top: 2px solid var(--fg); }
  .gc-total-sum { margin-left: auto; text-align: right; font-variant-numeric: tabular-nums; }
  .gc-total-sum span { display: block; font-size: 10.5px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: .14em; }
  .gc-total-sum b { display: block; margin-top: 1px; font-size: 21px; font-weight: 800; letter-spacing: -.01em; }
  /* The shadow is baked into the seal images: a CSS drop-shadow would be repainted on
     every frame of the stamp animation. */
  .gc-stamp { flex: none; width: 80px; height: 80px; margin: 0 0 0 2px; object-fit: contain; pointer-events: none;
    transform: translate(var(--dx), var(--dy)) rotate(var(--turn)); }
  .gc-stamp-ink { display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%;
    border: 3px double var(--red); color: var(--red); font-weight: 800; font-size: 10px; letter-spacing: .12em; line-height: 1.1; }
  .gc-stamp-ink b { font-size: 24px; letter-spacing: 0; }
  .gc-stamp-ink small { font-size: 8px; letter-spacing: .14em; }
  /* Lands just as the verified screen finishes clearing: drops in fast, presses a touch
     past flat, settles. Transform and opacity only, on its own layer. */
  html.gc-revealed .gc-stamp { will-change: transform, opacity; animation: gc-thump 440ms 180ms both; }
  @keyframes gc-thump {
    0% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(calc(var(--turn) - 10deg)) scale(1.7);
      animation-timing-function: cubic-bezier(.55, 0, 1, .45); }
    52% { opacity: 1; transform: translate(var(--dx), var(--dy)) rotate(var(--turn)) scale(.93);
      animation-timing-function: cubic-bezier(0, .55, .45, 1); }
    100% { opacity: 1; transform: translate(var(--dx), var(--dy)) rotate(var(--turn)) scale(1); }
  }
  /* Claims on this card */
  .gc-claims h2 { margin-bottom: 6px; }
  .gc-claim { padding: 7px 0; border-top: 1px solid var(--line); }
  .gc-claims h2 + .gc-claim { border-top: 0; padding-top: 0; }
  .gc-claim-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .gc-claim-ref { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 700; }
  .gc-claim-sub { margin-top: 2px; font-size: 12.5px; color: var(--muted); }
  .gc-claim-note { margin-top: 5px; padding: 6px 9px; border-radius: 8px; background: var(--card2); font-size: 13px; }
  .gc-status { font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; white-space: nowrap; background: var(--card2); border: 1px solid var(--line); }
  .gc-status.is-approved, .gc-status.is-replaced { background: var(--ok-bg); color: var(--ok); border-color: transparent; }
  .gc-status.is-rejected { background: var(--bad-bg); color: var(--bad); border-color: transparent; }
  .gc-status.is-reviewing { background: color-mix(in srgb, var(--brass) 22%, transparent); color: var(--brass-text); border-color: transparent; }

  /* Short terms, in small print */
  .gc-terms-short { margin: 0 2px 8px; font-size: 10.5px; line-height: 1.45; color: var(--muted); font-weight: 400; }
  .gc-terms-short > span { display: block; margin-bottom: 2px; font-size: 9.5px; text-transform: uppercase; letter-spacing: .14em; }
  .gc-terms-short ul { margin: 0; padding-left: 13px; }
  .gc-terms-short li::marker { font-size: 9px; }

  /* Buttons */
  .gc-claim-btn { width: 100%; min-height: 44px; }
  .gc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 0 14px; border-radius: 12px;
    border: 1px solid var(--line); background: var(--card); color: var(--fg); font: 700 14px Inter, system-ui, sans-serif; text-decoration: none; cursor: pointer; }
  .gc-btn, .gc-submit, .gc-issue, .gc-photo-add { transition: transform 120ms ease, filter 120ms ease; }
  .gc-btn:active, .gc-submit:active, .gc-issue:active, .gc-photo-add:active { transform: scale(.97); filter: brightness(.96); }
  .gc-btn.is-primary { background: var(--brass); border-color: transparent; color: var(--brass-ink); box-shadow: var(--lift); }

  /* Sheets: bottom sheet on a phone, dialog on a wider screen */
  .gc-sheet-backdrop { position: fixed; inset: 0; z-index: 60; display: flex; align-items: flex-end; justify-content: center;
    background: rgba(18, 17, 15, .48); animation: gc-fade 180ms ease-out both; }
  /* Phones: the sheet is the whole screen (a bottom sheet fights the keyboard). */
  .gc-sheet { width: 100%; height: 100%; height: 100dvh; display: flex; flex-direction: column; background: var(--bg); color: var(--fg);
    animation: gc-up 240ms cubic-bezier(.2,.9,.3,1) both; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
  @media (min-width: 640px) {
    .gc-sheet-backdrop { align-items: center; padding: 24px; }
    .gc-sheet { max-width: 560px; height: auto; max-height: 88vh; border-radius: 18px; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
  }
  .gc-sheet-head { flex: none; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line);
    padding: calc(10px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 10px calc(16px + env(safe-area-inset-left)); }
  .gc-sheet-head h3 { margin: 0; font-size: 17px; font-weight: 800; }
  .gc-sheet-x { width: 44px; height: 44px; margin-right: -6px; border-radius: 10px; border: 0; background: var(--card2, #ede9e1); color: inherit; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .gc-sheet-x svg, .gc-photo button svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; }
  .gc-sheet-body { flex: 1; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
    padding: 14px calc(16px + env(safe-area-inset-right)) 0 calc(16px + env(safe-area-inset-left)); }
  .gc-done { padding-bottom: calc(18px + env(safe-area-inset-bottom)); }
  /* Submit stays at the bottom of the screen while the form scrolls. */
  .gc-form-foot { position: sticky; bottom: 0; z-index: 2; display: grid; gap: 8px; margin: 0 calc(-16px - env(safe-area-inset-right)) 0 calc(-16px - env(safe-area-inset-left));
    padding: 10px calc(16px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));
    background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-top: 1px solid var(--line); }
  @keyframes gc-fade { from { opacity: 0 } }
  @keyframes gc-up { from { transform: translateY(24px); opacity: 0 } }


  /* Claim form */
  .gc-form { display: grid; gap: 14px; }
  .gc-form-lead { margin: 0; font-size: 13px; color: var(--muted, #78716c); }
  .gc-form fieldset { margin: 0; padding: 12px 14px 14px; border: 1px solid var(--line, rgba(28,25,23,.12)); border-radius: 14px; background: var(--card, #f3f0ea); display: grid; gap: 10px; min-width: 0; }
  .gc-form legend { display: flex; align-items: center; gap: 8px; padding: 0 6px; margin-left: -6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: var(--brass-text, #7d5f22); }
  .gc-form legend span { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--brass, #b9924b); color: var(--brass-ink, #201804); font-size: 11px; letter-spacing: 0; }
  .gc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 400px) { .gc-row2 { grid-template-columns: 1fr; } }
  .gc-field { display: grid; gap: 5px; min-width: 0; position: relative; }
  .gc-field > span { font-size: 12px; font-weight: 700; color: var(--muted, #78716c); }
  .gc-field input, .gc-field select, .gc-field textarea { width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; border-radius: 10px;
    border: 1px solid var(--line, rgba(28,25,23,.12)); background: var(--bg, #e8e5df); color: inherit; font: 500 16px Inter, system-ui, sans-serif; outline: none; resize: vertical; }
  .gc-field textarea { min-height: 0; line-height: 1.4; }
  /* 16px or more: below that, iPhone Safari zooms the page in when a box is tapped. */
  .gc-field input:focus, .gc-field select:focus, .gc-field textarea:focus { border-color: var(--brass, #b9924b); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brass, #b9924b) 28%, transparent); }
  .gc-field.has-error input, .gc-field.has-error select, .gc-field.has-error textarea { border-color: var(--red, #9f1d20); }
  .gc-err { font-size: 12px; font-weight: 600; color: var(--red, #9f1d20); }
  .gc-note { font-size: 12px; color: var(--muted, #78716c); }
  .gc-count { position: absolute; right: 10px; top: 0; font-size: 11px; color: var(--muted, #78716c); }
  .gc-issues { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .gc-issue { display: grid; gap: 3px; text-align: left; padding: 10px; border-radius: 12px; border: 1.5px solid var(--line, rgba(28,25,23,.12)); background: var(--bg, #e8e5df);
    color: inherit; font: inherit; cursor: pointer; }
  .gc-issue b { font-size: 14px; }
  .gc-issue small { font-size: 11px; line-height: 1.3; color: var(--muted, #78716c); }
  .gc-issue.is-on { border-color: var(--brass, #b9924b); background: color-mix(in srgb, var(--brass, #b9924b) 16%, var(--bg, #e8e5df)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brass, #b9924b) 22%, transparent); }
  .gc-photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .gc-proofs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .gc-proof { display: grid; align-content: start; gap: 3px; min-width: 0; }
  .gc-proof > b { margin-top: 3px; font-size: 12.5px; line-height: 1.2; }
  .gc-proof > small { font-size: 10.5px; line-height: 1.3; color: var(--muted); }
  .gc-proof.has-error .gc-photo-add { border-color: var(--red); color: var(--red); }
  .gc-photo, .gc-photo-add { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; }
  .gc-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gc-photo button { position: absolute; top: 4px; right: 4px; width: 34px; height: 34px; border-radius: 50%; border: 0; background: rgba(0,0,0,.6); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .gc-photo-add { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 1.5px dashed var(--line, rgba(28,25,23,.25));
    background: var(--bg, #e8e5df); color: var(--muted, #78716c); font: 600 12px Inter, system-ui, sans-serif; cursor: pointer; }
  .gc-photo-add svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
  .gc-photos.has-error .gc-photo-add { border-color: var(--red, #9f1d20); }
  .gc-check { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 14px; border: 1px solid var(--line, rgba(28,25,23,.12)); background: var(--card, #f3f0ea); font-size: 13.5px; line-height: 1.45; cursor: pointer; }
  .gc-check input { width: 20px; height: 20px; margin: 1px 0 0; flex: none; accent-color: var(--brass, #b9924b); }
  .gc-check.has-error { border-color: var(--red, #9f1d20); }
  .gc-fail { padding: 10px 12px; border-radius: 10px; background: var(--bad-bg); color: var(--bad); font-size: 13.5px; font-weight: 600; }
  .gc-submit { min-height: 50px; border: 0; border-radius: 12px; background: var(--brass, #b9924b); color: var(--brass-ink, #201804); font: 800 15px Inter, system-ui, sans-serif;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: var(--lift); }
  .gc-submit:disabled { opacity: .75; cursor: progress; }
  .gc-spin { width: 16px; height: 16px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: gc-rot 700ms linear infinite; }
  @keyframes gc-rot { to { transform: rotate(360deg) } }

  /* Submitted */
  .gc-done { display: grid; justify-items: center; gap: 10px; text-align: center; padding: 6px 0 2px; }
  .gc-done-tick { width: 64px; height: 64px; }
  .gc-done-tick circle { fill: var(--brass, #b9924b); }
  .gc-done-tick path { fill: none; stroke: #fff; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; }
  .gc-done h4 { margin: 4px 0 0; font-size: 20px; font-weight: 800; }
  .gc-done-ref { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 17px; font-weight: 800; padding: 6px 14px; border-radius: 10px; background: var(--card, #f3f0ea); border: 1px solid var(--line, rgba(28,25,23,.12)); }
  .gc-next { text-align: left; margin: 6px 0 4px; padding-left: 20px; display: grid; gap: 7px; font-size: 14px; line-height: 1.45; }
  .gc-done-ref-note { font-size: 12px; color: var(--muted, #78716c); }
  .gc-done .gc-submit { width: 100%; }
  .gc-empty { color: var(--muted); font-size: 14px; padding: 6px 0; }
  .gc-miss { text-align: center; padding: 40px 20px; color: var(--muted); }
  .gc-miss h2 { color: var(--fg); margin: 0 0 8px; }

  .gc-verify { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px;
    background: radial-gradient(110% 80% at 50% 40%, var(--card) 0%, var(--bg) 70%); color: var(--fg);
    transition: opacity 300ms ease, transform 300ms ease; will-change: opacity, transform; }
  .gc-verify.is-leaving { opacity: 0; transform: scale(1.03); pointer-events: none; }
  .gc-verify-inner { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .gc-mark { position: relative; width: 132px; height: 132px; margin-bottom: 26px; }
  .gc-logo-tile { position: absolute; inset: 6px; border-radius: 28px; background: #fff; padding: 18px; box-shadow: var(--lift);
    animation: gc-pop 380ms cubic-bezier(.2,1.3,.4,1) both; }
  .gc-logo-tile { color: #1c1917; } /* dark ink on the white tile, in either theme */
  .gc-logo-tile svg { width: 100%; height: 100%; display: block; }
  .gc-tick { position: absolute; right: -10px; bottom: -10px; width: 62px; height: 62px; border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,.22); will-change: transform;
    animation: gc-badge 340ms cubic-bezier(.2,1.6,.4,1) 260ms both; }
  .gc-tick .disc { fill: var(--brass); stroke: var(--bg); stroke-width: 3; }
  .gc-tick .mark { fill: none; stroke: #fff; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 30; stroke-dashoffset: 30; animation: gc-draw 240ms cubic-bezier(.65,0,.35,1) 440ms forwards; }
  .gc-ripple { position: absolute; right: -10px; bottom: -10px; width: 62px; height: 62px; border-radius: 50%; border: 2px solid var(--brass);
    animation: gc-ripple 800ms ease-out 500ms both; }
  .gc-verify-title { font-size: 23px; font-weight: 800; letter-spacing: -.01em; animation: gc-rise 320ms ease-out 400ms both; }
  .gc-verify-sub { margin-top: 7px; font-size: 13px; color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    animation: gc-rise 320ms ease-out 470ms both; }
  .gc-verify-sub .sep { margin: 0 8px; opacity: .6; }
  @keyframes gc-pop { 0% { transform: scale(.6); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
  @keyframes gc-badge { 0% { transform: scale(0) rotate(-30deg) } 100% { transform: scale(1) rotate(0) } }
  @keyframes gc-draw { to { stroke-dashoffset: 0 } }
  @keyframes gc-ripple { 0% { transform: scale(1); opacity: .9 } 100% { transform: scale(2.1); opacity: 0 } }
  @keyframes gc-rise { 0% { transform: translateY(8px); opacity: 0 } 100% { transform: none; opacity: 1 } }
  @media (prefers-reduced-motion: reduce) {
    .gc-logo-tile, .gc-tick, .gc-verify-title, .gc-verify-sub { animation: none; }
    .gc-tick .mark { animation: none; stroke-dashoffset: 0; }
    .gc-ripple { display: none; }
    html.gc-revealed .gc-stamp { animation: none; }
  }
`

export default async function GuaranteePage({ params, searchParams }) {
  const { number } = await params
  const { k } = (await searchParams) ?? {}
  const token = typeof k === 'string' ? k.trim() : ''
  const [doc, claims] = await Promise.all([getGuarantee(number, token), getClaims(number, token)])

  const branded = isBranded(doc)

  if (!doc) {
    return (
      <div className="gc-page">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="gc-wrap">
          <Head number={number} />
          <div className="gc-miss">
            <h2>Card not found</h2>
            <p>No guarantee card matches <b>{number}</b>. Please check the link, or contact the seller.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gc-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Verified number={doc.number || number} branded={branded} />
      <div className="gc-wrap">
        <FitToScreen>
          <Head number={doc.number || number} verified branded={branded} />
          <CardView doc={doc} token={token} claims={claims} branded={branded} />
        </FitToScreen>
      </div>
    </div>
  )
}

function Head({ number, verified = false, branded = false }) {
  return (
    <div className="gc-head">
      {branded ? (
        <span className="gc-logo is-brand"><img src="/assets/guarantee/shiv-logo.png" alt="Shiv Hardware" width="154" height="174" /></span>
      ) : (
        <span className="gc-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2.5c2.2 1.7 4.9 2.6 7.5 2.6v5.6c0 4.9-3.2 8.4-7.5 9.8-4.3-1.4-7.5-4.9-7.5-9.8V5.1c2.6 0 5.3-.9 7.5-2.6z" />
          </svg>
        </span>
      )}
      <div className="gc-brand">
        {branded ? 'Shiv Hardware' : 'Guarantee Card'}
        <small>{branded ? 'Guarantee Card' : 'Online record'}</small>
      </div>
      <div className="gc-head-right">
        <span className="gc-tag">{number}</span>
        {verified ? (
          <span className="gc-verified">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Verified
          </span>
        ) : null}
      </div>
    </div>
  )
}

function CardView({ doc, token, claims, branded = false }) {
  const cust = doc.customer || {}
  const items = Array.isArray(doc.items) ? doc.items : []
  const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0)
  const maxYears = Math.max(0, ...items.map((it) => Number(it.guaranteeYears) || 0))
  const dateStr = doc.date ? new Date(doc.date).toLocaleDateString('en-GB') : ''

  return (
    <>
      <div className="gc-card">
        <div className="gc-name">{cust.name || '—'}</div>
        <div className="gc-facts">
          <div className="gc-fact"><span className="k">Aadhaar</span><span className="v">{cust.uid || 'N/A'}</span></div>
          <div className="gc-fact"><span className="k">Phone</span><span className="v">{cust.mobile ? <a href={`tel:${cust.mobile}`}>{cust.mobile}</a> : 'N/A'}</span></div>
          {dateStr ? <div className="gc-fact"><span className="k">Date</span><span className="v">{dateStr}</span></div> : null}
        </div>
      </div>

      <div className="gc-card">
        <h2>Items</h2>
        {items.length ? items.map((it, i) => {
          const spec = [fmtThickness(it.thickness), itemSize(it)].filter(Boolean)
          const qty = Number(it.qty) || 0
          return (
            <div className="gc-item" key={i}>
              <div className="gc-item-body">
                <div className="gc-item-top">
                  <div className="brand">{it.brandName || '—'}</div>
                  {Number(it.amount) ? <span className="gc-amt">{rupees(it.amount)}</span> : null}
                </div>
                {spec.length || qty ? (
                  <div className="gc-item-bottom">
                    {spec.length ? (
                      <span className="gc-spec">
                        {spec.map((s, j) => <span key={j}>{j ? <span className="dot">·</span> : null}{s}</span>)}
                      </span>
                    ) : null}
                    {qty ? <span className="gc-qty">{qty} {qty === 1 ? 'pc' : 'pcs'}</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          )
        }) : <div className="gc-empty">No items listed on this card.</div>}
        {total > 0 || maxYears > 0 ? (
          <div className="gc-total">
            <Stamp years={maxYears} seed={doc.number} />
            {total > 0 ? <div className="gc-total-sum"><span>Total</span><b>{rupees(total)}</b></div> : null}
          </div>
        ) : null}
      </div>
      {claims.length ? (
        <div className="gc-card gc-claims">
          <h2>Your claims</h2>
          {claims.map((c) => (
            <div className="gc-claim" key={c.ref}>
              <div className="gc-claim-top">
                <span className="gc-claim-ref">{c.ref}</span>
                <span className={`gc-status is-${c.status}`}>{CLAIM_STATUS[c.status] || c.status}</span>
              </div>
              <div className="gc-claim-sub">
                {CLAIM_ISSUE[c.issue] || c.issue} · {c.doors} {c.doors === 1 ? 'door' : 'doors'} · {new Date(c.createdAt).toLocaleDateString('en-GB')}
              </div>
              {c.note ? <div className="gc-claim-note">{c.note}</div> : null}
            </div>
          ))}
        </div>
      ) : null}
      <div className="gc-terms-short">
        <span>Terms</span>
        <ul>
          <li>Covers borer, air bubbles and cracks only.</li>
          <li>Termite damage is not covered.</li>
          <li>Valid for the years shown, from the date on this card.</li>
          <li>Replacement requires the original card and bill, subject to inspection.</li>
        </ul>
      </div>
      <CardActions
        seller={branded ? 'Shiv Hardware Store' : ''}
        convexUrl={CONVEX_URL}
        number={doc.number}
        token={token}
        items={items.map((it) => ({
          label: [it.brandName || 'Item', fmtThickness(it.thickness), itemSize(it)].filter(Boolean).join(' · '),
          qty: Number(it.qty) || 0,
        }))}
      />
    </>
  )
}
