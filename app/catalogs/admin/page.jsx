'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { nameFromFilename } from '@/lib/catalogs'
import CatalogActions from '../CatalogActions'

const PDFJS_VERSION = '4.7.76'

// Render page 1 of a PDF to an optimized JPEG entirely in the browser.
async function renderFirstPage(file) {
  const pdfjs = await import(
    /* webpackIgnore: true */ `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.mjs`
  )
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`

  const data = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data }).promise
  const page = await pdf.getPage(1)

  const targetW = 1080
  const base = page.getViewport({ scale: 1 })
  const viewport = page.getViewport({ scale: targetW / base.width })

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(viewport.width)
  canvas.height = Math.round(viewport.height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvasContext: ctx, viewport }).promise

  const toBlob = (q) => new Promise((res) => canvas.toBlob(res, 'image/jpeg', q))
  let q = 0.82
  let blob = await toBlob(q)
  while (blob && blob.size > 150 * 1024 && q > 0.5) {
    q -= 0.08
    blob = await toBlob(q)
  }
  return { blob, width: canvas.width, height: canvas.height }
}

function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  )
}

function IconFile(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconSpinner(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin" {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function AdminUploadPage() {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewData, setPreviewData] = useState(null) // { blob, width, height }
  const [phase, setPhase] = useState('idle') // idle | rendering | ready | uploading | done | error
  const [error, setError] = useState('')
  const [link, setLink] = useState('')

  const reset = () => {
    setFile(null)
    setName('')
    setPreviewUrl('')
    setPreviewData(null)
    setPhase('idle')
    setError('')
    setLink('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const onPick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      setPhase('error')
      return
    }
    setError('')
    setLink('')
    setFile(f)
    setName(nameFromFilename(f.name))
    setPhase('rendering')
    try {
      const { blob, width, height } = await renderFirstPage(f)
      if (!blob) throw new Error('render failed')
      setPreviewData({ blob, width, height })
      setPreviewUrl(URL.createObjectURL(blob))
      setPhase('ready')
    } catch (err) {
      console.error(err)
      setError('Could not read this PDF. Make sure it is a valid, non-password-protected PDF.')
      setPhase('error')
    }
  }

  const onUpload = async () => {
    if (!file || !previewData) return
    setPhase('uploading')
    setError('')
    try {
      const { slug } = await fetch(`/api/catalogs/slug?name=${encodeURIComponent(name)}`).then((r) => r.json())
      if (!slug) throw new Error('Could not generate a link name.')

      const pdfBlob = await upload(`catalogs/${slug}/file.pdf`, file, {
        access: 'public',
        contentType: 'application/pdf',
        handleUploadUrl: '/api/catalogs/upload',
      })
      const imgBlob = await upload(`catalogs/${slug}/preview.jpg`, previewData.blob, {
        access: 'public',
        contentType: 'image/jpeg',
        handleUploadUrl: '/api/catalogs/upload',
      })

      const res = await fetch('/api/catalogs/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          pdfUrl: pdfBlob.url,
          imageUrl: imgBlob.url,
          width: previewData.width,
          height: previewData.height,
        }),
      })
      if (!res.ok) throw new Error('Could not save the catalogue.')

      setLink(`https://www.shivhardware.store/catalogs/c/${slug}`)
      setPhase('done')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Upload failed. Please try again.')
      setPhase('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#999]">Shiv Hardware Store</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Upload catalogue</h1>
          </div>
          <Link href="/catalogs" className="text-xs font-semibold uppercase tracking-wide text-[#999] underline underline-offset-4 hover:text-white">
            All catalogues
          </Link>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        {phase !== 'done' && (
          <>
            {/* File picker */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/25 px-6 py-12 text-center transition-colors hover:border-white/50 hover:bg-white/5"
            >
              <IconUpload />
              <span className="text-sm font-semibold">{file ? 'Choose a different PDF' : 'Tap to choose a PDF'}</span>
              <span className="text-xs text-[#999]">The name and preview are set automatically</span>
            </button>
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={onPick} className="hidden" />

            {/* Selected file + derived name */}
            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-[#999]">
                  <IconFile />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-[#999]">{file.name}</p>
                </div>
              </div>
            )}

            {/* Preview */}
            {phase === 'rendering' && (
              <p className="mt-6 flex items-center justify-center gap-2 text-sm text-[#999]">
                <IconSpinner /> Generating preview…
              </p>
            )}
            {previewUrl && phase !== 'rendering' && (
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#999]">Preview customers will see</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="First page preview" className="mx-auto w-full max-w-[300px] rounded-xl border border-white/10" />
              </div>
            )}

            {error && (
              <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
            )}

            {/* Upload button */}
            {(phase === 'ready' || phase === 'uploading' || (phase === 'error' && previewData)) && (
              <button
                type="button"
                onClick={onUpload}
                disabled={phase === 'uploading'}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {phase === 'uploading' ? (
                  <>
                    <IconSpinner /> Uploading…
                  </>
                ) : (
                  <>
                    <IconUpload /> Publish &amp; get link
                  </>
                )}
              </button>
            )}
          </>
        )}

        {/* Success */}
        {phase === 'done' && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white">
              <IconCheck />
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">{name}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#999]">Published — link ready</p>

            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="mx-auto mt-5 w-full max-w-[240px] rounded-xl border border-white/10" />
            )}

            <div className="mt-5 break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-[#bbb]">{link}</div>

            <CatalogActions link={link} name={name} />

            <button
              type="button"
              onClick={reset}
              className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#999] underline underline-offset-4 hover:text-white"
            >
              Upload another
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
