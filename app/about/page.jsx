import Hero from '@/components/Hero'

export const metadata = {
  title: 'About Stara, Craft — Stara',
  description: 'Stara began as a family workshop and grew into Stara, Craft — combining local craft and modern manufacturing.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="About Stara, Craft"
        subtitle="Doors that craft a moment"
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
                Stara began as a family workshop and grew into <strong>Stara, Craft</strong> — a parent label combining local craft and modern manufacturing. We believe doors are more than panels and hinges: they are thresholds, statements, and service. Every Stara door is engineered for longevity, finished for beauty, and installed for performance.
              </p>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--fg)]">
                Our Mission
              </h2>
              
              <ul className="space-y-4 text-[var(--fg)]">
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Build beautiful, long-lasting doors.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Support local installers and dealers.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[var(--accent)]">•</span>
                  <span>Provide transparent specs and easy custom orders.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

