import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact — Stara',
  description: 'Get in touch with Stara. Request a quote, schedule a site visit, or find a dealer near you.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url(/assets/texture-stone-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--fg)]">
              Contact Us
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Find the nearest Stara dealer, request a sample, or schedule a site visit. Dealers carry samples, measurement help and installation services.
            </p>
            
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}

