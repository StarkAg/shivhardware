import Hero from '@/components/Hero'
import CollectionShowcase from '@/components/ProductGrid' // Component renamed but file stays ProductGrid.jsx
import ValueProps from '@/components/ValueProps'
import collectionsMetadata from '@/data/collections-metadata.json'
import { preload } from 'react-dom'

// Structured JSON-LD data for organization (home page only)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shiv Hardware Store',
  url: 'https://shivhardware.store',
  logo: 'https://shivhardware.store/White%20Logo.png',
  sameAs: [],
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+91-80928-50954',
    contactType: 'customer service',
    areaServed: 'IN',
  }],
}

export default function Home() {
  // Hero images for a faster first paint; only this page shows them.
  preload('/assets/hero-1.jpg', { as: 'image' })
  preload('/assets/hero-video-frame.jpg', { as: 'image' })
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Hero
        title="Doors that elevate"
        subtitle="Turning ordinary spaces into moments worth remembering."
        rotatingWords={[
          'space',
          'design',
          'aesthetics',
          'texture',
          'environment',
        ]}
        mediaType="carousel"
        mediaSrc={[
          { type: 'image', src: '/assets/Gemini_Generated_Image_r5x9s5r5x9s5r5x9.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_al57hgal57hgal57.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_li0rn8li0rn8li0r.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_ejtid0ejtid0ejti.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_sa0iwnsa0iwnsa0i.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_vr21xdvr21xdvr21.png' },
          { type: 'image', src: '/assets/Gemini_Generated_Image_5egbsq5egbsq5egb.png' },
          { type: 'video', src: '/assets/vid.mp4', poster: '/assets/Gemini_Generated_Image_r5x9s5r5x9s5r5x9.png' },
        ]}
        ctas={[
          { text: 'Explore Collections', href: '/collections', variant: 'primary' },
          { text: 'Our Craft', href: 'https://wa.me/918092850954?text=Hi%2C%20I%20am%20interested%20in%20the%20Products%20you%20are%20offering.', variant: 'secondary' },
        ]}
        kicker="Craftsmanship | Heritage | Modern Manufacturing"
      />
      
      <section id="collections" className="bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-16">
          <div className="max-w-4xl mx-auto text-center mb-0 md:mb-24">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-[var(--fg)]">
              Our Collections
            </h2>
          </div>
          <CollectionShowcase collections={collectionsMetadata} />
        </div>
      </section>
      
      <ValueProps />
    </main>
  )
}

