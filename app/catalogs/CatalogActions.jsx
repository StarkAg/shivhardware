'use client'

import { useState } from 'react'

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

function IconCopy(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

// The confirm button lands in a different spot at each of the 5 steps, so the
// delete can't be dismissed by rapid-clicking in one place.
const CONFIRM_POS = [
  'left-6 top-1/3',
  'right-6 top-1/3',
  'left-6 bottom-1/3',
  'right-6 bottom-1/3',
  'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
]

export default function CatalogActions({ link, name, slug, inline = false, deletable = false, onDelete }) {
  const [copied, setCopied] = useState(false)
  const [confirmStep, setConfirmStep] = useState(0) // 0 = closed, 1..5 = which confirmation

  const remove = () => {
    if (!slug) return
    setConfirmStep(1)
  }
  const advanceConfirm = () => {
    setConfirmStep((s) => {
      if (s >= CONFIRM_POS.length) {
        // All 5 confirmed → instant removal, background delete.
        onDelete?.(slug)
        return 0
      }
      return s + 1
    })
  }
  const cancelConfirm = () => setConfirmStep(0)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback for older browsers
      const t = document.createElement('textarea')
      t.value = link
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(link)}`

  // Compact icon-only row (used in the catalogue list)
  if (inline) {
    const iconBtn = 'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors'
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            title={copied ? 'Copied' : 'Copy link'}
            aria-label="Copy link"
            className={`${iconBtn} border border-white/20 text-white hover:bg-white hover:text-black`}
          >
            {copied ? <IconCheck /> : <IconCopy />}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
            className={`${iconBtn} bg-white text-black hover:opacity-90`}
          >
            <IconWhatsApp />
          </a>
          {deletable && (
            <button
              type="button"
              onClick={remove}
              title="Delete catalogue"
              aria-label="Delete catalogue"
              className={`${iconBtn} border border-white/20 text-[#999] hover:border-red-500/60 hover:text-red-400`}
            >
              <IconTrash />
            </button>
          )}
        </div>

        {confirmStep > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={cancelConfirm}
          >
            {/* Message */}
            <div className="absolute left-1/2 top-12 w-full max-w-xs -translate-x-1/2 px-4 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                Confirm delete — {confirmStep} of {CONFIRM_POS.length}
              </p>
              <p className="mt-3 text-sm text-white">
                Delete “{name}”? This permanently removes the catalogue and its share link.
              </p>
            </div>

            {/* Confirm button — moves each step */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                advanceConfirm()
              }}
              className={`absolute ${CONFIRM_POS[confirmStep - 1]} inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-colors hover:bg-red-600`}
            >
              <IconTrash />
              {confirmStep === CONFIRM_POS.length ? 'Confirm delete' : `Confirm (${confirmStep}/${CONFIRM_POS.length})`}
            </button>

            {/* Cancel — stays put, easy to reach */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                cancelConfirm()
              }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white hover:text-black"
            >
              Cancel
            </button>
          </div>
        )}
      </>
    )
  }

  // Labeled buttons (used on the upload success screen)
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
      >
        {copied ? <IconCheck /> : <IconCopy />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
      >
        <IconWhatsApp />
        Share
      </a>
    </div>
  )
}
