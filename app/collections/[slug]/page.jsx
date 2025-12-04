import Image from 'next/image'
import Link from 'next/link'
import productsData from '@/data/products.json'

export async function generateMetadata({ params }) {
  const product = productsData.find(p => p.slug === params.slug)
  return {
    title: product ? `${product.title} — Stara Collections` : `${params.slug} — Stara Collections`,
    description: product 
      ? `Explore the ${product.title} collection from Stara. ${product.subtitle}. Premium doors with detailed specifications.`
      : `Explore the ${params.slug} collection from Stara. Premium doors with detailed specifications and warranty information.`,
  }
}

export default function CollectionDetailPage({ params }) {
  // Find product from data file
  const collection = productsData.find(p => p.slug === params.slug) || {
    name: params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug: params.slug,
    image: '/assets/cards/card-1.jpg',
    summary: 'Premium door collection featuring exceptional quality and craftsmanship.',
    specs: {
      thickness: '40 mm (other sizes available)',
      core: 'HDF / Solid / Marine (choose)',
      finish: 'Matte / Satin / Textured',
      warranty: '5 years (finish) / 10 years (core)',
    },
  }
  
  // Use collection data if found, otherwise use defaults
  const product = collection ? {
    name: collection.title || collection.name,
    subtitle: collection.subtitle || '',
    image: collection.image || '/assets/cards/card-1.jpg',
    summary: collection.subtitle || 'Premium door collection featuring exceptional quality and craftsmanship.',
    specs: {
      thickness: '40 mm (other sizes available)',
      core: 'HDF / Solid / Marine (choose)',
      finish: 'Matte / Satin / Textured',
      warranty: '5 years (finish) / 10 years (core)',
    },
  } : {
    name: params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    subtitle: '',
    image: '/assets/cards/card-1.jpg',
    summary: 'Premium door collection featuring exceptional quality and craftsmanship.',
    specs: {
      thickness: '40 mm (other sizes available)',
      core: 'HDF / Solid / Marine (choose)',
      finish: 'Matte / Satin / Textured',
      warranty: '5 years (finish) / 10 years (core)',
    },
  }

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--fg)]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-[var(--fg)]">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--fg)]">{product.name}</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed max-w-3xl">
                {product.summary}
              </p>
            </div>

            <div className="relative w-full aspect-[16/9] mb-12 bg-[var(--muted)]/10 overflow-hidden">
              <Image
                src={product.image || '/assets/card-1.jpg'}
                alt={product.name}
                fill
                className="object-cover bw-image"
                unoptimized
              />
              {/* Texture overlay for depth */}
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/texture-wood-1.jpg)',
                  backgroundSize: 'cover',
                }}
              />
            </div>
            
            {/* Product Schema for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Product',
                  name: product.name,
                  description: product.summary,
                  image: product.image,
                  brand: {
                    '@type': 'Brand',
                    name: 'Stara, Craft',
                  },
                }),
              }}
            />

            <div className="grid md:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--fg)]">Specifications</h2>
                <table className="w-full">
                  <tbody className="space-y-2">
                    <tr className="border-b border-[var(--muted)]/20">
                      <td className="py-3 font-medium text-[var(--fg)]">Thickness:</td>
                      <td className="py-3 text-[var(--muted)]">{product.specs.thickness}</td>
                    </tr>
                    <tr className="border-b border-[var(--muted)]/20">
                      <td className="py-3 font-medium text-[var(--fg)]">Core:</td>
                      <td className="py-3 text-[var(--muted)]">{product.specs.core}</td>
                    </tr>
                    <tr className="border-b border-[var(--muted)]/20">
                      <td className="py-3 font-medium text-[var(--fg)]">Finish:</td>
                      <td className="py-3 text-[var(--muted)]">{product.specs.finish}</td>
                    </tr>
                    <tr className="border-b border-[var(--muted)]/20">
                      <td className="py-3 font-medium text-[var(--fg)]">Warranty:</td>
                      <td className="py-3 text-[var(--muted)]">{product.specs.warranty}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-[var(--fg)]">Learn More</h2>
                <div className="space-y-4">
                  <a
                    href="/contact"
                    className="block w-full bg-[var(--accent)] text-[var(--bg)] px-6 py-4 text-center font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
                  >
                    Inquire
                  </a>
                  <a
                    href="/dealer-locator"
                    className="block w-full border border-[var(--accent)] text-[var(--accent)] px-6 py-4 text-center font-medium hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
                  >
                    Find a Dealer
                  </a>
                  <a
                    href="/about"
                    className="block w-full border border-[var(--muted)]/30 text-[var(--fg)] px-6 py-4 text-center font-medium hover:border-[var(--accent)] transition-colors duration-300 hover-scale"
                  >
                    Our Craft
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

