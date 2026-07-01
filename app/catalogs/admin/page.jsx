import Link from 'next/link'
import CatalogHeader from '../CatalogHeader'
import Uploader from '../Uploader'

export const metadata = {
  title: 'Upload catalogue — Shiv Hardware Store',
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

export default function AdminUploadPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <CatalogHeader />
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Upload catalogue</h1>
          <Link
            href="/catalogs"
            aria-label="Home"
            title="Home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <IconHome />
          </Link>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        <Uploader />
      </div>
    </main>
  )
}
