import { Suspense } from 'react'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Custom Orders — Shiv Hardware Store',
  description: 'Request a custom order. Any size, any finish. In-house design consultation available. Lead times: 4–8 weeks.',
}

export default function CustomPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url(/assets/texture-wood-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
                Custom Orders
              </h1>
              <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed mb-12">
                Made to order. Any size, any finish. In-house design consultation available. 
                Each custom order is a collaboration between you and our team.
              </p>
              
              <div className="space-y-6 text-[var(--fg)] mb-16">
                <div>
                  <h2 className="text-2xl font-bold mb-4">The Process</h2>
                  <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">
                    Our custom service works with you to create products that are uniquely yours. 
                    From initial consultation to final delivery, we guide you through every step.
                  </p>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-4 text-[var(--accent)] text-xl">•</span>
                    <div>
                      <span className="font-medium block mb-1">Any size, any finish</span>
                      <span className="text-[var(--muted)]">Tailored to your exact specifications</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 text-[var(--accent)] text-xl">•</span>
                    <div>
                      <span className="font-medium block mb-1">In-house design consultation</span>
                      <span className="text-[var(--muted)]">Work directly with our design team</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 text-[var(--accent)] text-xl">•</span>
                    <div>
                      <span className="font-medium block mb-1">Lead times: 4–8 weeks</span>
                      <span className="text-[var(--muted)]">From consultation to delivery</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <Suspense fallback={<div className="text-[var(--muted)]">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}

