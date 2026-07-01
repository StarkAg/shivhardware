import Link from 'next/link'
import Image from 'next/image'

// Minimal branded header for the catalogue pages — logo + name only,
// none of the main site's nav, footer, smooth-scroll or cursor effects.
export default function CatalogHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
        <Link href="/catalogs" className="flex items-center gap-3" aria-label="Shiv Hardware Store catalogues">
          <span className="relative block h-9 w-9 flex-shrink-0 sm:h-10 sm:w-10">
            <Image src="/White Logo.png" alt="Shiv Hardware Store logo" fill className="object-contain" sizes="40px" priority />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Shiv Hardware Store</span>
        </Link>
      </div>
    </header>
  )
}
