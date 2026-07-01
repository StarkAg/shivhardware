import Link from 'next/link'
import { listCatalogs } from '@/lib/catalogs'
import CatalogActions from './CatalogActions'

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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#999]">Shiv Hardware Store</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Catalogues</h1>
          </div>
          <Link
            href="/catalogs/admin"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-90 sm:self-auto"
          >
            <IconPlus />
            Upload new catalogue
          </Link>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        {cats.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-6 py-16 text-center">
            <p className="text-sm text-[#999]">No catalogues yet.</p>
            <Link href="/catalogs/admin" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">
              <IconPlus /> Upload your first catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => {
              const link = `${SITE}/catalogs/c/${cat.slug}`
              return (
                <div
                  key={cat.slug}
                  className="flex flex-col rounded-2xl border border-white/10 bg-black/20 p-3 transition-colors hover:border-white/25"
                >
                  <a href={link} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="aspect-[3/4] w-full object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </a>
                  <h2 className="mt-3 line-clamp-2 px-1 text-sm font-semibold tracking-tight">{cat.name}</h2>
                  <div className="mt-auto px-1">
                    <CatalogActions link={link} name={cat.name} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
