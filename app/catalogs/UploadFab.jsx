'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Uploader from './Uploader'

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

export default function UploadFab() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Lock body scroll while the modal is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Floating add button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Upload new catalogue"
        title="Upload new catalogue"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      >
        <IconPlus />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with home button */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Upload catalogue</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Home"
                title="Home"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
              >
                <IconHome />
              </button>
            </div>

            <Uploader onUploaded={() => router.refresh()} onHome={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
