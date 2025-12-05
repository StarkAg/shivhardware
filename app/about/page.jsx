import Hero from '@/components/Hero'

export const metadata = {
  title: 'About — Shiv Hardware Store',
  description: 'Shiv Hardware Store - Your trusted source for premium building materials and hardware solutions in Ramgarh, Jharkhand.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="About Shiv Hardware Store"
        subtitle="Your trusted source for premium building materials"
        mediaType="image"
        mediaSrc="/assets/showroom-1.jpg"
        ctas={[
          { text: 'Explore Collections', href: '/collections', variant: 'primary' },
          { text: 'Contact Us', href: '/contact', variant: 'secondary' },
        ]}
      />
      
      <section className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/assets/texture-wood-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-[var(--fg)] mb-8">
                <strong>Shiv Hardware Store</strong> is a trusted name in Ramgarh, Jharkhand, specializing in premium building materials and hardware solutions. With a rating of 4.4/5 from our customers, we pride ourselves on quality products and excellent service.
              </p>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--fg)]">
                Our Mission
              </h2>
              
              <ul className="space-y-4 text-[var(--fg)] mb-8">
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Provide high-quality building materials and hardware products.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Offer expert guidance and customer support.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Build lasting relationships with our customers and community.</span>
                </li>
              </ul>

              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--fg)]">
                Visit Us
              </h2>
              
              <div className="space-y-3 text-[var(--muted)]">
                <p>
                  <span className="font-medium text-[var(--fg)]">Location:</span> Ramgarh Cantonment, Ramgarh, Jharkhand
                </p>
                <p>
                  <span className="font-medium text-[var(--fg)]">Phone:</span>{' '}
                  <a href="tel:+918092850954" className="text-[var(--accent)] hover:underline">
                    080928 50954
                  </a>
                </p>
                <p>
                  <span className="font-medium text-[var(--fg)]">Hours:</span> 10:30 AM - 7:00 PM (Closed Tuesdays)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

