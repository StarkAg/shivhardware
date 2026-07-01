import Link from 'next/link'
import { listCatalogs } from '@/lib/catalogs'
import CatalogList from './CatalogList'
import CatalogHeader from './CatalogHeader'
import UploadFab from './UploadFab'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Catalogues — Shiv Hardware Store',
  description: 'Browse and share Shiv Hardware Store product catalogues.',
}

const SITE = 'https://www.shivhardware.store'

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default async function CatalogsPortal() {
  const cats = await listCatalogs()

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <CatalogHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-center text-base font-semibold uppercase tracking-[0.2em]">Catalogues</h1>

        <div className="my-8 h-px w-full bg-white/10" />

        {cats.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-6 py-16 text-center">
            <p className="text-sm text-[#999]">No catalogues yet.</p>
            <Link href="/catalogs/admin" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">
              <IconPlus /> Upload your first catalogue
            </Link>
          </div>
        ) : (
          <CatalogList cats={cats} site={SITE} />
        )}
      </div>

      <UploadFab />
    </main>
  )
}
