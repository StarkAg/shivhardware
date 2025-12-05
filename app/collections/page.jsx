import Hero from '@/components/Hero'
import CollectionShowcase from '@/components/ProductGrid'
import collectionsMetadata from '@/data/collections-metadata.json'

export const metadata = {
  title: 'Collections — Shiv Hardware Store',
  description: 'Explore our product collections: Plywood & MDF, Fevicol Adhesives, Kitchen Systems, Hinges & Handles, Wardrobe Fittings, Door Locks, and General Hardware.',
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Our Collections"
        subtitle="Premium hardware and building materials for every project. Quality products from trusted manufacturers."
        mediaType="image"
        mediaSrc="/assets/hero-2.jpg"
        ctas={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' },
          { text: 'About Us', href: '/about', variant: 'secondary' },
        ]}
      />
      
      <section className="bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              Each collection features carefully selected products from leading manufacturers. 
              From construction materials to hardware fittings, we provide quality solutions for your building needs.
            </p>
          </div>
          <CollectionShowcase collections={collectionsMetadata} />
        </div>
      </section>
    </main>
  )
}

