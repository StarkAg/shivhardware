import Hero from '@/components/Hero'
import CollectionShowcase from '@/components/ProductGrid' // Component renamed but file stays ProductGrid.jsx
import ValueProps from '@/components/ValueProps'

export default function Home() {
  return (
    <main className="min-h-screen">
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
          { type: 'image', src: '/assets/hero-1.jpg', poster: '/assets/hero-1.jpg' },
          { type: 'video', src: '/assets/vid.mp4', poster: '/assets/hero-video-frame.jpg' },
          { type: 'image', src: '/assets/hero-2.jpg', poster: '/assets/hero-2.jpg' },
        ]}
        ctas={[
          { text: 'Explore Collections', href: '/collections', variant: 'primary' },
          { text: 'Our Craft', href: '/about', variant: 'secondary' },
        ]}
        kicker="Craftsmanship | Heritage | Modern Manufacturing"
      />
      
      <ValueProps />
      
      <section id="collections" className="bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              Our Collections
            </h2>
            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              Each collection represents a distinct approach to door making—from modern minimalism to heritage craftsmanship. 
              Explore our range of thoughtfully designed doors.
            </p>
          </div>
          <CollectionShowcase />
        </div>
      </section>
    </main>
  )
}

