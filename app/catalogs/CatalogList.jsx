'use client'

import { useEffect, useRef, useState } from 'react'
import CatalogActions from './CatalogActions'

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function formatDate(ts) {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return '—'
  }
}

function formatSize(bytes) {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i > 0 && n < 10 ? 1 : 0)} ${units[i]}`
}

export default function CatalogList({ cats, site }) {
  const [q, setQ] = useState('')
  const [items, setItems] = useState(cats)
  const [detailsFor, setDetailsFor] = useState(null)

  const pressTimer = useRef(null)
  const firedRef = useRef(false)

  // Sync when the server sends fresh data (e.g. after a new upload).
  useEffect(() => {
    setItems(cats)
  }, [cats])

  const startPress = (cat) => {
    firedRef.current = false
    clearTimeout(pressTimer.current)
    pressTimer.current = setTimeout(() => {
      firedRef.current = true
      setDetailsFor(cat)
    }, 500)
  }
  const cancelPress = () => clearTimeout(pressTimer.current)

  const handleDelete = (slug) => {
    setItems((prev) => prev.filter((c) => c.slug !== slug)) // instant UI removal
    fetch('/api/catalogs/delete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {}) // background; storage catches up
  }

  const query = q.trim().toLowerCase()
  const filtered = query ? items.filter((c) => c.name.toLowerCase().includes(query)) : items

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">
          <IconSearch />
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search catalogues…"
          aria-label="Search catalogues"
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#777] focus:border-white/30 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#999]">No catalogues match “{q}”.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((cat) => {
            const link = `${site}/catalogs/c/${cat.slug}`
            return (
              <div
                key={cat.slug}
                className="flex select-none items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 transition-colors hover:border-white/25 sm:gap-4 sm:p-5 [-webkit-touch-callout:none]"
                onTouchStart={() => startPress(cat)}
                onTouchEnd={cancelPress}
                onTouchMove={cancelPress}
                onMouseDown={() => startPress(cat)}
                onMouseUp={cancelPress}
                onMouseLeave={cancelPress}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setDetailsFor(cat)
                }}
                onClickCapture={(e) => {
                  // Swallow the click that follows a long-press so the link doesn't open.
                  if (firedRef.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    firedRef.current = false
                  }
                }}
              >
                <a href={link} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cat.imageUrl} alt={cat.name} className="h-20 w-16 object-cover object-top sm:h-24 sm:w-[72px]" />
                </a>
                <a href={link} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold leading-snug tracking-tight break-words sm:text-base">{cat.name}</h2>
                </a>
                <div className="shrink-0">
                  <CatalogActions link={link} name={cat.name} slug={cat.slug} inline deletable onDelete={handleDelete} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Long-press details */}
      {detailsFor && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetailsFor(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold leading-snug tracking-tight break-words">{detailsFor.name}</h3>
            <div className="my-4 h-px w-full bg-white/10" />
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#999]">Uploaded</dt>
                <dd className="text-right text-white">{formatDate(detailsFor.createdAt)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#999]">Size</dt>
                <dd className="text-right text-white">{formatSize(detailsFor.size)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#999]">Device</dt>
                <dd className="text-right text-white">{detailsFor.device || '—'}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setDetailsFor(null)}
              className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
