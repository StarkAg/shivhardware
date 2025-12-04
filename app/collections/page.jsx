import Hero from '@/components/Hero'
import CollectionShowcase from '@/components/ProductGrid' // Component renamed but file stays ProductGrid.jsx

export const metadata = {
  title: 'Collections — Stara',
  description: 'Explore our door collections: Modern Series, Heritage Series, WeatherGuard, Acoustic Series, Slimline Flush, and Custom Atelier.',
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Our Collections"
        subtitle="Each collection represents a distinct approach to door making—from modern minimalism to heritage craftsmanship."
        mediaType="image"
        mediaSrc="/assets/hero-2.jpg"
        ctas={[
          { text: 'Our Craft', href: '/about', variant: 'primary' },
          { text: 'Contact', href: '/contact', variant: 'secondary' },
        ]}
      />
      
      <section className="bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              Each collection is engineered for longevity, finished for beauty, and installed for performance. 
              Explore our range of thoughtfully designed doors, each telling its own story of craft and design.
            </p>
          </div>
          <CollectionShowcase />
        </div>
      </section>
    </main>
  )
}

