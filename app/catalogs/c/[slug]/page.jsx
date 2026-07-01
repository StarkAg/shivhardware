import { notFound } from 'next/navigation'
import { getCatalog } from '@/lib/catalogs'

export const dynamic = 'force-dynamic'

const SITE = 'https://www.shivhardware.store'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const cat = await getCatalog(slug)
  if (!cat) return { title: 'Catalogue not found — Shiv Hardware Store' }
  return {
    title: `${cat.name} — Shiv Hardware Store`,
    description: `${cat.name} — full catalogue. Tap to view all designs.`,
    openGraph: {
      type: 'website',
      siteName: 'Shiv Hardware Store',
      title: cat.name,
      description: 'Shiv Hardware Store — tap to view the full catalogue.',
      url: `${SITE}/catalogs/c/${slug}`,
      images: [{ url: cat.imageUrl, width: cat.width || undefined, height: cat.height || undefined, alt: cat.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cat.name,
      images: [cat.imageUrl],
    },
    alternates: { canonical: `${SITE}/catalogs/c/${slug}` },
  }
}

export default async function CatalogRedirectPage({ params }) {
  const { slug } = await params
  const cat = await getCatalog(slug)
  if (!cat) notFound()

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[440px] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.imageUrl}
          alt={cat.name}
          className="w-full rounded-2xl border border-white/10 shadow-2xl"
        />
        <h1 className="mt-5 text-lg font-semibold tracking-tight">{cat.name}</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#999]">Opening catalogue…</p>
        <a
          href={cat.pdfUrl}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Tap here if it doesn’t open
        </a>
      </div>
      {/* Preview scrapers (WhatsApp etc.) read the meta tags above and never run this
          script, so the preview card is unaffected. Real visitors go to the PDF. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(cat.pdfUrl)})`,
        }}
      />
    </main>
  )
}
