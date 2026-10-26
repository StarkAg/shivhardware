// Public guarantee-card view. This is the target of the QR printed on Shiv
// Hardware guarantee cards: https://www.shivhardware.store/Gaurantee/GC-2026-XXXX
// It fetches the card from Convex and shows it as the card itself, lying on the
// plywood it guarantees: the years stencil-stamped on the wood, the customer's card
// on top (customer, phone, guaranteed items, the seal). Rendered per-request so newly
// printed cards resolve immediately, with no rebuild.

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { Big_Shoulders, Big_Shoulders_Stencil } from 'next/font/google'
import CardStage from './CardStage'
import CardActions from './CardActions'

export const dynamic = 'force-dynamic'

// The door's own lettering: the condensed face of the size marks stamped on plywood,
// its stencil cut for the years. Served from this site, not from Google. Next has no
// metrics to size a fallback for these faces; the stacks below fall back to narrow ones.
const text = Big_Shoulders({ subsets: ['latin'], axes: ['opsz'], display: 'swap', adjustFontFallback: false })
const stencil = Big_Shoulders_Stencil({ subsets: ['latin'], axes: ['opsz'], display: 'swap', adjustFontFallback: false })

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
const CLAIM_ISSUE = { borer: 'Borer', air: 'Air bubbles' }

// Sizes are inches + eighths (soot). Eighths print as their fraction glyph: 44 4/8" -> 44½″.
const EIGHTHS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞']
const NBSP = ' '
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
// Only the last four digits of the Aadhaar: the link can be shared, and a lost card read.
function maskUid(uid) {
  const digits = String(uid || '').replace(/\D/g, '')
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : uid || 'N/A'
}
// The shop's wax seals (Shiv_Panel/assets/seals). One goes on the card by the total,
// pressed at the angle a hand would leave it. The angle comes from the card number,
// so a card looks the same every time it is opened. A period with no seal of its own
// has none: the years stamped on the wood already say it.
const SEAL_YEARS = [1, 3, 7, 10, 20, 25]
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
function Seal({ years, seed }) {
  if (!SEAL_YEARS.includes(years)) return null
  const { turn, x, y } = stampPose(seed)
  const style = { '--turn': `${turn.toFixed(1)}deg`, '--dx': `${x}px`, '--dy': `${y}px` }
  return <img className="gc-seal" style={style} src={`/assets/guarantee/seal-${years}yr.png`} alt={`${years} year guarantee seal`} width="264" height="264" />
}
const rupees = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`
// Rows of one brand (and one guarantee period) together, in the card's order: the brand
// is said once, then one line per size. A card holds up to 18 rows (Shiv_Panel
// print-server/template.mjs CARD_ROW_STEP_MM), so this keeps a full one readable.
// The shop's short codes for the Signature range, written out where they stand as a word
// ("WPC Chowket S", "SGC"); the printed card keeps them short.
const BRAND_CODES = { S: 'Signature', SG: 'Signature Gold', SGC: 'Signature Gold Club' }
function brandLabel(name) {
  return String(name || '').trim().replace(/\b(SGC|SG|S)\b/g, (code) => BRAND_CODES[code])
}
function groupByBrand(items) {
  const groups = []
  for (const it of items) {
    const brand = brandLabel(it.brandName)
    const years = Number(it.guaranteeYears) || 0
    const last = groups[groups.length - 1]
    if (last && last.brand === brand && last.years === years) last.items.push(it)
    else groups.push({ brand, years, items: [it] })
  }
  return groups
}

/**
 * A card shows Shiv Hardware's name and logo for its first 20 days, counted from
 * its own date, and is neutral after that (no seller named anywhere, below).
 */
const BRANDED_DAYS = 20 // the same in the QR short link (Shiv_Panel/qr-redirect/middleware.js)
function isBranded(doc) {
  const issued = Date.parse(doc?.date ?? '') || Number(doc?.createdAt) || 0
  return issued > 0 && Date.now() - issued < BRANDED_DAYS * 24 * 60 * 60 * 1000
}

// The QR short link (Shiv_Panel/qr-redirect). Cards printed before it carry this
// site's own address in their QR, so past the branded days they still opened here
// with the shop's address in the bar. Such a card is sent to the short link, which
// serves this same page from its own address. Requests that came through the short
// link carry ?gc=1 (it passes its query on), so they are never sent back: no loop.
const SHORT_URL = 'https://gcvf.vercel.app'
function leaveShopAddress(doc, number, token, gc) {
  if (!doc || isBranded(doc) || gc) return
  if (!/^GC-[A-Za-z0-9-]+$/.test(number) || !/^[A-Z0-9]{8,64}$/.test(token)) return
  redirect(`${SHORT_URL}/${number}/${token}?gc=1`)
}

// Neutral, nothing here names the seller: the site-wide title, description, author,
// social preview, canonical link and icon are all replaced for this page. A card in
// its first 20 days carries the shop's name and icon instead.
export async function generateMetadata({ params, searchParams }) {
  const { number } = await params
  const { k, gc } = (await searchParams) ?? {}
  const token = typeof k === 'string' ? k.trim() : ''
  const doc = await getGuarantee(number, token)
  leaveShopAddress(doc, number, token, gc)
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

// The wood is the page in light and dark alike: it is the material, not a theme.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#dcb67c',
}

const styles = `
  /* Tokens. Also set on the sheet layer, which is portalled to <body> outside .gc-page. */
  .gc-page, .gc-sheet-backdrop {
    --veneer: #e2c08a; --veneer-2: #d2a96b; --grain: rgba(120, 78, 30, .16);
    --ink: #1a120a; --ink-2: #4a3520; --stamp: #8e1c15;
    --pvc: #fbfaf7; --print: #17140f; --print-2: #5d5348; --rule: #e2dccf;
    --back: #0d0d0d; --gold: #c9a24f;
    --gc-text: ${text.style.fontFamily}, "Arial Narrow", "Roboto Condensed", system-ui, sans-serif;
    --gc-stencil: ${stencil.style.fontFamily}, "Arial Narrow", "Roboto Condensed", sans-serif;
    --gc-ui: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    /* The claim form's names for the same colours. */
    --bg: #f6eddc; --card: #fffdf8; --card2: #efe3cc; --fg: var(--ink); --muted: #5b4630;
    --line: rgba(26, 18, 10, .18); --brass: var(--ink); --brass-ink: #f2dcae; --brass-text: var(--stamp);
    --red: var(--stamp); --lift: 0 10px 28px rgba(60, 34, 8, .22);
    --ok: #146239; --ok-bg: #dcefe2; --bad: var(--stamp); --bad-bg: #f6e1dc;
    color-scheme: light;
  }
  .gc-page, .gc-sheet-backdrop { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
  .gc-page button, .gc-page a, .gc-sheet-backdrop button, .gc-sheet-backdrop label { touch-action: manipulation; }

  /* The plywood: rotary-cut veneer, its long wavy grain drawn in CSS (no image to load). */
  body:has(.gc-page) { margin: 0; background: #dcb67c; }
  /* No scroll bar over the wood (or the claim form): it still scrolls by finger, wheel and keys. */
  html:has(.gc-page), .gc-sheet-body { scrollbar-width: none; }
  html:has(.gc-page)::-webkit-scrollbar, .gc-sheet-body::-webkit-scrollbar { display: none; }
  .gc-page { min-height: 100vh; min-height: 100dvh; overflow-x: clip; color: var(--ink); font-family: var(--gc-text);
    font-optical-sizing: auto;
    background:
      repeating-radial-gradient(ellipse 260% 26% at 30% -40%, transparent 0 13px, var(--grain) 14px 15px, transparent 16px 31px),
      repeating-linear-gradient(176deg, transparent 0 7px, rgba(120, 78, 30, .06) 8px 9px, transparent 10px 23px),
      linear-gradient(180deg, var(--veneer) 0%, var(--veneer-2) 100%); }
  .gc-door { max-width: 460px; min-height: 100vh; min-height: 100dvh; margin: 0 auto; display: grid; grid-template-rows: auto auto 1fr auto; gap: 10px;
    padding: calc(14px + env(safe-area-inset-top)) calc(18px + env(safe-area-inset-right)) calc(16px + env(safe-area-inset-bottom)) calc(18px + env(safe-area-inset-left)); }

  .gc-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-weight: 800; font-size: 16px; letter-spacing: .06em; text-transform: uppercase; }
  .gc-who { display: inline-flex; align-items: center; gap: 9px; min-width: 0; }
  .gc-who img { width: 30px; height: 34px; flex: none; object-fit: contain; background: #fff; border-radius: 6px; padding: 3px; }
  .gc-who svg { width: 22px; height: 22px; flex: none; }
  .gc-ok { color: var(--stamp); display: inline-flex; gap: 5px; align-items: center; white-space: nowrap; }
  .gc-ok svg { width: 18px; height: 18px; }

  /* The years, stamped on the board in stencil ink. */
  .gc-years { display: flex; align-items: flex-end; gap: 10px; margin-top: 8px; color: var(--stamp); }
  .gc-years .n { font-family: var(--gc-stencil); font-weight: 900; font-size: clamp(92px, 30vw, 132px); line-height: .78; letter-spacing: -.02em; }
  .gc-years .w { font-family: var(--gc-stencil); font-weight: 700; font-size: clamp(28px, 9vw, 38px); line-height: .9; text-transform: uppercase; padding-bottom: 2px; }
  .gc-years .w small { display: block; margin-top: 5px; font-family: var(--gc-text); font-weight: 700; font-size: 16px; letter-spacing: .03em; text-transform: none; color: var(--ink-2); }

  /* The card: 54 x 86, as large as the screen allows beside the years and the button;
     a card with many items grows taller rather than cramping them. */
  .gc-stage { display: grid; place-items: center; perspective: 1300px; padding: 4px 0 8px; }
  .gc-card { position: relative; display: grid; width: min(84vw, 330px, calc((100dvh - 390px) * 54 / 86)); min-width: min(250px, 100%); aspect-ratio: 54 / 86;
    transform-style: preserve-3d; transform: rotate(var(--lean, -2.5deg)) rotateY(var(--ry, 0deg)) rotateX(var(--rx, 0deg)); }
  .gc-card::before { content: ""; position: absolute; inset: 4% 3% -3% 5%; border-radius: 6%; background: rgba(60, 34, 8, .42); filter: blur(14px); transform: translateZ(-1px); }
  /* No overflow: hidden on the faces: it would stop the card growing to fit its items
     (an aspect-ratio box only grows with content that is allowed to overflow). */
  .gc-face { border-radius: 14px; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .gc-back { position: absolute; inset: 0; transform: rotateY(180deg); background: var(--back); }
  .gc-back::before { content: ""; position: absolute; inset: 6%; border: 2px solid var(--gold); border-radius: 10px; }
  .gc-front { position: relative; background: var(--pvc); color: var(--print); padding: 26px 24px 22px; display: grid; grid-template-rows: auto auto 1fr auto;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06); }
  /* PVC catches the light: a sheen that moves with the tilt. */
  .gc-front::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; mix-blend-mode: soft-light;
    background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, .8) calc(45% + var(--shine, 0%)), transparent 62%); }
  .gc-no { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 2px 10px; font-size: 15px; font-weight: 700; color: var(--print-2); text-transform: uppercase; letter-spacing: .05em; }
  .gc-no b { margin-left: auto; color: var(--print); font-weight: 800; letter-spacing: .06em; font-variant-numeric: tabular-nums; white-space: nowrap; }
  /* A card in its first 20 days carries the shop's mark, printed on it like the name
     (the shop's name in words is in the bar above). */
  .gc-maker { display: inline-flex; align-self: center; }
  .gc-maker img { width: 28px; height: 32px; object-fit: contain; }
  .gc-front h1 { margin: 12px 0 0; font-size: clamp(25px, 7.6vw, 30px); line-height: .98; font-weight: 800; text-transform: uppercase; letter-spacing: .01em; text-wrap: balance; overflow-wrap: anywhere; }
  .gc-facts { margin: 9px 0 0; display: grid; grid-template-columns: auto 1fr; gap: 1px 12px; font-size: 17px; }
  .gc-facts dt { color: var(--print-2); font-weight: 500; }
  .gc-facts dd { margin: 0; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: .02em; }
  .gc-facts a { color: inherit; text-decoration: none; border-radius: 2px; }
  .gc-facts a:focus-visible { outline: 3px solid var(--stamp); outline-offset: 2px; }
  .gc-rows { margin-top: 12px; border-top: 2px solid var(--print); align-self: start; }
  .gc-items { margin: 0; padding: 0; list-style: none; }
  .gc-items li { padding: 6px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .gc-items li.brand { padding: 8px 0 1px; border-bottom: 0; font-size: 15px; font-weight: 700; color: var(--print-2); text-transform: uppercase; letter-spacing: .04em; }
  .gc-items li.brand span { color: var(--stamp); white-space: nowrap; }
  .gc-items .spec { font-family: var(--gc-stencil); font-weight: 700; font-size: 20px; letter-spacing: .02em; line-height: 1.05; text-transform: uppercase; font-variant-numeric: tabular-nums; }
  .gc-items .spec span span { white-space: nowrap; }
  .gc-items .amt { font-weight: 800; font-size: 18px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .gc-none { margin: 8px 0 0; font-size: 16px; color: var(--print-2); }
  .gc-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; margin-top: 10px; }
  .gc-seal { width: 36%; max-width: 116px; height: auto; aspect-ratio: 1; margin: 0 0 -6% -5%; pointer-events: none;
    translate: var(--dx) var(--dy); rotate: var(--turn); }
  .gc-sum { margin-left: auto; text-align: right; }
  .gc-sum small { display: block; font-size: 15px; font-weight: 700; color: var(--print-2); text-transform: uppercase; letter-spacing: .05em; }
  .gc-sum b { font-size: clamp(29px, 9vw, 34px); font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }

  /* The opening, CSS from the first paint: the card lands face down and turns over,
     the years ink onto the wood, the seal is pressed. Content is all there without it. */
  @media (prefers-reduced-motion: no-preference) {
    .gc-card:not(.is-turned) { animation: gc-turn 1.2s cubic-bezier(.2, .8, .2, 1) .15s both; }
    .gc-years > * { animation: gc-ink .3s steps(3, end) both; }
    .gc-years .n { animation-delay: 1.1s; }
    .gc-years .w { animation-delay: 1.25s; }
    .gc-seal { animation: gc-press .45s cubic-bezier(.3, 1.5, .5, 1) 1.4s both; }
  }
  @keyframes gc-turn { from { transform: rotate(-9deg) translateY(-18px) rotateY(-180deg) rotateX(8deg); } }
  @keyframes gc-ink { from { opacity: 0; transform: scale(1.1); filter: blur(1.5px); } to { opacity: 1; transform: none; filter: none; } }
  @keyframes gc-press { from { opacity: 0; scale: 1.7; rotate: calc(var(--turn) - 12deg); } to { opacity: 1; scale: 1; rotate: var(--turn); } }

  /* Claims on this card, stamped on the wood like the items. */
  .gc-claims { display: grid; gap: 8px; }
  .gc-claims h2 { margin: 4px 0 0; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
  .gc-claim { padding: 9px 12px; border: 2.5px solid var(--ink); border-radius: 3px; }
  .gc-claim-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .gc-claim-ref { font-family: var(--gc-stencil); font-weight: 700; font-size: 21px; letter-spacing: .03em; }
  .gc-claim-sub { margin-top: 2px; font-size: 16px; font-weight: 500; color: var(--ink-2); }
  .gc-claim-note { margin-top: 5px; font-size: 16px; font-weight: 500; }
  .gc-status { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
  .gc-status.is-approved, .gc-status.is-replaced { color: var(--ok); }
  .gc-status.is-rejected { color: var(--stamp); }

  .gc-act { display: grid; gap: 8px; }
  /* A transparent border: in Windows High Contrast, where backgrounds go, it keeps the button's shape. */
  .gc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; padding: 0 16px; border-radius: 3px; border: 2px solid transparent;
    background: var(--ink); color: var(--brass-ink); font: 800 20px var(--gc-text); text-transform: uppercase; letter-spacing: .08em; cursor: pointer; }
  .gc-btn:focus-visible, .gc-submit:focus-visible, .gc-sheet-x:focus-visible { outline: 3px solid var(--stamp); outline-offset: 3px; }
  .gc-btn, .gc-submit, .gc-issue, .gc-photo-add { transition: transform 120ms ease, filter 120ms ease; }
  .gc-btn:active, .gc-submit:active, .gc-issue:active, .gc-photo-add:active { transform: scale(.97); filter: brightness(.9); }
  .gc-terms { margin: 0; font-size: 16px; line-height: 1.3; color: var(--ink-2); font-weight: 500; text-align: center; text-wrap: balance; }


  /* A computer: the card on the left, the years and the claim beside it, all in one
     screen even on a short laptop. */
  @media (min-width: 860px) {
    .gc-door { max-width: 880px; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto auto 1fr; column-gap: 56px; align-content: center; }
    .gc-top { grid-column: 1 / -1; }
    .gc-stage { grid-column: 1; grid-row: 2 / 4; align-self: center; }
    .gc-years { grid-column: 2; grid-row: 2; align-self: end; }
    .gc-act { grid-column: 2; grid-row: 3; align-self: start; padding-top: 18px; }
    .gc-card { width: min(380px, calc((100dvh - 110px) * 54 / 86)); }
    .gc-terms { text-align: left; }
  }

  .gc-miss { align-self: center; display: grid; gap: 8px; padding: 24px 0; }
  .gc-miss h1 { margin: 0; font-family: var(--gc-stencil); font-weight: 900; font-size: 64px; line-height: .85; color: var(--stamp); text-transform: uppercase; }
  .gc-miss p { margin: 0; font-size: 19px; line-height: 1.3; font-weight: 500; }

  /* Sheets: the whole screen on a phone (a bottom sheet fights the keyboard), a dialog wider. */
  .gc-sheet-backdrop { position: fixed; inset: 0; z-index: 60; display: flex; align-items: flex-end; justify-content: center;
    background: rgba(26, 18, 10, .5); animation: gc-fade 180ms ease-out both; }
  .gc-sheet { width: 100%; height: 100%; height: 100dvh; display: flex; flex-direction: column; background: var(--bg); color: var(--fg);
    animation: gc-up 240ms cubic-bezier(.2, .9, .3, 1) both; font-family: var(--gc-ui); }
  @media (min-width: 640px) {
    .gc-sheet-backdrop { align-items: center; padding: 24px; }
    .gc-sheet { max-width: 560px; height: auto; max-height: 88vh; border-radius: 6px; box-shadow: 0 20px 60px rgba(0, 0, 0, .3); }
  }
  .gc-sheet-head { flex: none; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--ink);
    padding: calc(10px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 10px calc(16px + env(safe-area-inset-left)); }
  .gc-sheet-head h3 { margin: 0; font: 800 22px var(--gc-text); text-transform: uppercase; letter-spacing: .05em; }
  .gc-sheet-x { width: 44px; height: 44px; margin-right: -6px; border-radius: 6px; border: 0; background: var(--card2); color: inherit; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .gc-sheet-x svg, .gc-photo button svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; }
  .gc-sheet-body { flex: 1; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
    padding: 14px calc(16px + env(safe-area-inset-right)) 0 calc(16px + env(safe-area-inset-left)); }
  .gc-form-foot { position: sticky; bottom: 0; z-index: 2; display: grid; gap: 8px; margin: 0 calc(-16px - env(safe-area-inset-right)) 0 calc(-16px - env(safe-area-inset-left));
    padding: 10px calc(16px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));
    background: var(--bg); border-top: 1px solid var(--line); }
  @keyframes gc-fade { from { opacity: 0 } }
  @keyframes gc-up { from { transform: translateY(24px); opacity: 0 } }

  /* Claim form: typed text in the phone's own face, which reads best in a form. */
  .gc-form { display: grid; gap: 14px; }
  .gc-form-lead { margin: 0; font-size: 14px; color: var(--muted); }
  .gc-form fieldset { margin: 0; padding: 12px 14px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); display: grid; gap: 10px; min-width: 0; }
  .gc-form legend { display: flex; align-items: center; gap: 8px; padding: 0 6px; margin-left: -6px; font: 800 17px var(--gc-text); text-transform: uppercase; letter-spacing: .06em; color: var(--brass-text); }
  .gc-form legend span { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--ink); color: var(--brass-ink); font-size: 13px; letter-spacing: 0; }
  .gc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 400px) { .gc-row2 { grid-template-columns: 1fr; } }
  .gc-field { display: grid; gap: 5px; min-width: 0; position: relative; }
  .gc-field > span { font-size: 13px; font-weight: 700; color: var(--muted); }
  /* 16px or more: below that, iPhone Safari zooms the page in when a box is tapped. */
  .gc-field input, .gc-field select, .gc-field textarea { width: 100%; box-sizing: border-box; min-height: 46px; padding: 10px 12px; border-radius: 6px;
    border: 1px solid var(--line); background: var(--bg); color: inherit; font: 500 16px var(--gc-ui); outline: none; resize: vertical; }
  .gc-field textarea { min-height: 0; line-height: 1.4; }
  .gc-field input:focus, .gc-field select:focus, .gc-field textarea:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(26, 18, 10, .18); }
  .gc-field.has-error input, .gc-field.has-error select, .gc-field.has-error textarea { border-color: var(--red); }
  .gc-err { font-size: 13px; font-weight: 600; color: var(--red); }
  .gc-note { font-size: 13px; color: var(--muted); }
  .gc-count { position: absolute; right: 10px; top: 0; font-size: 12px; color: var(--muted); }
  .gc-issues { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .gc-issue { display: grid; gap: 3px; text-align: left; padding: 10px; border-radius: 6px; border: 1.5px solid var(--line); background: var(--bg); color: inherit; font: inherit; cursor: pointer; }
  .gc-issue b { font-size: 15px; }
  .gc-issue small { font-size: 12.5px; line-height: 1.3; color: var(--muted); }
  .gc-issue.is-on { border-color: var(--ink); background: var(--card2); box-shadow: 0 0 0 2px var(--ink); }
  .gc-photos, .gc-proofs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .gc-proof { display: grid; align-content: start; gap: 3px; min-width: 0; }
  .gc-proof > b { margin-top: 3px; font-size: 13px; line-height: 1.2; }
  .gc-proof > small { font-size: 12px; line-height: 1.3; color: var(--muted); }
  .gc-proof.has-error .gc-photo-add { border-color: var(--red); color: var(--red); }
  .gc-photo, .gc-photo-add { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; }
  .gc-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gc-photo button { position: absolute; top: 4px; right: 4px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(0, 0, 0, .62); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .gc-photo-add { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 1.5px dashed rgba(26, 18, 10, .35);
    background: var(--bg); color: var(--muted); font: 600 13px var(--gc-ui); cursor: pointer; }
  .gc-photo-add svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
  .gc-photos.has-error .gc-photo-add { border-color: var(--red); }
  .gc-check { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--line); background: var(--card); font-size: 14px; line-height: 1.45; cursor: pointer; }
  .gc-check input { width: 22px; height: 22px; margin: 1px 0 0; flex: none; accent-color: var(--ink); }
  .gc-check.has-error { border-color: var(--red); }
  .gc-fail { padding: 10px 12px; border-radius: 6px; background: var(--bad-bg); color: var(--bad); font-size: 14px; font-weight: 600; }
  .gc-submit { min-height: 54px; border: 2px solid transparent; border-radius: 3px; background: var(--ink); color: var(--brass-ink); font: 800 19px var(--gc-text); text-transform: uppercase; letter-spacing: .08em;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
  .gc-submit:disabled { opacity: .75; cursor: progress; }
  .gc-spin { width: 16px; height: 16px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: gc-rot 700ms linear infinite; }
  @keyframes gc-rot { to { transform: rotate(360deg) } }

  /* Submitted */
  .gc-done { display: grid; justify-items: center; gap: 10px; text-align: center; padding: 6px 0 calc(18px + env(safe-area-inset-bottom)); }
  .gc-done-tick { width: 64px; height: 64px; }
  .gc-done-tick circle { fill: var(--ink); }
  .gc-done-tick path { fill: none; stroke: var(--brass-ink); stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; }
  .gc-done h4 { margin: 4px 0 0; font: 800 26px var(--gc-text); text-transform: uppercase; letter-spacing: .04em; }
  .gc-done-ref { font: 700 24px var(--gc-stencil); letter-spacing: .04em; padding: 6px 14px; border: 2.5px solid var(--ink); border-radius: 3px; }
  .gc-next { text-align: left; margin: 6px 0 4px; padding-left: 20px; display: grid; gap: 7px; font-size: 15px; line-height: 1.45; }
  .gc-done-ref-note { font-size: 13px; color: var(--muted); }
  .gc-done .gc-submit { width: 100%; }
`

export default async function GuaranteePage({ params, searchParams }) {
  const { number } = await params
  const { k, gc } = (await searchParams) ?? {}
  const token = typeof k === 'string' ? k.trim() : ''
  const [doc, claims] = await Promise.all([getGuarantee(number, token), getClaims(number, token)])
  leaveShopAddress(doc, number, token, gc)

  const branded = isBranded(doc)

  if (!doc) {
    return (
      <div className="gc-page">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <main className="gc-door">
          <Top />
          <div className="gc-miss">
            <h1>Card not found</h1>
            <p>No guarantee card matches <b>{number}</b>. Please scan the QR on the card again, or ask the seller.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="gc-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <CardView doc={doc} number={doc.number || number} token={token} claims={claims} branded={branded} />
    </div>
  )
}

function Top({ verified = false, branded = false }) {
  return (
    <div className="gc-top">
      {branded ? (
        <span className="gc-who"><img src="/assets/guarantee/shiv-logo.png" alt="" width="154" height="174" />Shiv Hardware</span>
      ) : (
        <span className="gc-who">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2.5c2.2 1.7 4.9 2.6 7.5 2.6v5.6c0 4.9-3.2 8.4-7.5 9.8-4.3-1.4-7.5-4.9-7.5-9.8V5.1c2.6 0 5.3-.9 7.5-2.6z" />
          </svg>
          Guarantee card
        </span>
      )}
      {verified ? (
        <span className="gc-ok">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Verified
        </span>
      ) : null}
    </div>
  )
}

function CardView({ doc, number, token, claims, branded = false }) {
  const cust = doc.customer || {}
  const items = Array.isArray(doc.items) ? doc.items : []
  const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0)
  const maxYears = Math.max(0, ...items.map((it) => Number(it.guaranteeYears) || 0))
  const dateStr = doc.date ? new Date(doc.date).toLocaleDateString('en-GB').replaceAll('/', '.') : ''

  return (
    <main className="gc-door">
      <Top verified branded={branded} />

      {maxYears > 0 ? (
        <div className="gc-years" role="img" aria-label={`${maxYears} year guarantee against borer`}>
          <span className="n" aria-hidden="true">{maxYears}</span>
          <span className="w" aria-hidden="true">{maxYears === 1 ? 'Year' : 'Years'}<small>guarantee against borer</small></span>
        </div>
      ) : <div />}

      <CardStage label={`Guarantee card ${number}`} rows={items.length}>
        <div className="gc-face gc-front">
          <div className="gc-no">
            {branded
              ? <span className="gc-maker"><img src="/assets/guarantee/shiv-logo.png" alt="Shiv Hardware" width="154" height="174" /></span>
              : 'Guarantee card'}
            <b>{number}</b>
          </div>
          <div>
            <h1>{cust.name || '—'}</h1>
            <dl className="gc-facts">
              <dt>Aadhaar</dt><dd>{maskUid(cust.uid)}</dd>
              <dt>Phone</dt><dd>{cust.mobile ? <a href={`tel:${cust.mobile}`}>{cust.mobile}</a> : 'N/A'}</dd>
              {dateStr ? <><dt>Date</dt><dd>{dateStr}</dd></> : null}
            </dl>
          </div>
          <div className="gc-rows">
          {items.length ? groupByBrand(items).map((g, i) => (
            <ul className="gc-items" key={i}>
              {g.brand || g.years !== maxYears ? (
                <li className="brand">{g.brand}{g.years !== maxYears ? <span>{g.years ? `${g.years} ${g.years === 1 ? 'yr' : 'yrs'}` : 'No guarantee'}</span> : null}</li>
              ) : null}
              {g.items.map((it, j) => {
                const qty = Number(it.qty) || 0
                const spec = [fmtThickness(it.thickness), itemSize(it), qty ? `${qty} ${qty === 1 ? 'pc' : 'pcs'}` : ''].filter(Boolean)
                return (
                  <li key={j}>
                    {/* Each part kept whole: a line breaks between "81″ × 36″" and "4 pcs", never inside one. */}
                    <span className="spec">{spec.length ? spec.map((s, k) => <span key={k}>{k ? ' · ' : ''}<span>{s}</span></span>) : '—'}</span>
                    {Number(it.amount) ? <span className="amt">{rupees(it.amount)}</span> : null}
                  </li>
                )
              })}
            </ul>
          )) : <p className="gc-none">No items listed on this card.</p>}
          </div>
          <div className="gc-foot">
            <Seal years={maxYears} seed={number} />
            {total > 0 ? <div className="gc-sum"><small>Total</small><b>{rupees(total)}</b></div> : null}
          </div>
        </div>
      </CardStage>

      <div className="gc-act">
        {claims.length ? (
          <section className="gc-claims">
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
          </section>
        ) : null}
        <CardActions
          seller={branded ? 'Shiv Hardware Store' : ''}
          convexUrl={CONVEX_URL}
          number={number}
          token={token}
          items={items.map((it) => ({
            label: [brandLabel(it.brandName) || 'Item', fmtThickness(it.thickness), itemSize(it)].filter(Boolean).join(' · '),
            qty: Number(it.qty) || 0,
          }))}
        />
        {/* A card made with its termite line switched off is guaranteed against termites too. */}
        <p className="gc-terms">
          {doc.termiteNote === false ? 'Covers borer, termites and air bubbles' : 'Covers borer and air bubbles, not termites'}, from the card&apos;s date.
          {' '}Bring the original card and bill; the door is inspected.
        </p>
      </div>
    </main>
  )
}
