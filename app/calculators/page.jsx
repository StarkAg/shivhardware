'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/Hero'
import { cardStaggerReveal } from '@/lib/animations'

export default function CalculatorsPage() {
  const gridRef = useRef(null)
  const cardsRef = useRef([])

  const calculators = [
    {
      id: 1,
      title: 'Aluminium Door',
      subtitle: 'With chaukhat, ready for wet areas',
      image: '/assets/card-1.jpg',
      href: '/aluminium-door',
    },
    {
      id: 2,
      title: '2 Track Window',
      subtitle: 'Area-based rates and premium glass options',
      image: '/assets/card-2.jpg',
      href: '/window-2track',
    },
    {
      id: 3,
      title: '3 Track Window',
      subtitle: 'With half SS net and customization options',
      image: '/assets/card-1.jpg',
      href: '/window-3track',
    },
  ]

  useEffect(() => {
    if (!gridRef.current) return

    const articles = gridRef.current.querySelectorAll('article')
    articles.forEach((article) => {
      article.classList.add('card')
    })

    const trigger = cardStaggerReveal(gridRef.current)

    return () => {
      if (trigger) {
        trigger.kill()
      }
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Hero
        title="Pricing Calculators"
        subtitle="Get accurate, estimator-grade pricing for aluminium doors and windows. Configure dimensions, thickness, and add-ons to see real-time quotes."
        mediaType="image"
        mediaSrc="/assets/showroom-1.jpg"
        ctas={[
          { text: 'Explore Collections', href: '/collections', variant: 'primary' },
          { text: 'Contact Us', href: '/contact', variant: 'secondary' },
        ]}
      />
      
      <section className="bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-0"
          >
            {calculators.map((calc, index) => (
              <Link
                key={calc.id}
                href={calc.href}
                className="group relative block overflow-hidden hover-scale"
              >
                <article
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el
                  }}
                  className="relative h-[70vh] min-h-[500px] overflow-hidden"
                >
                  {/* Calculator Image - Full bleed */}
                  <div className="absolute inset-0">
                    <Image
                      src={calc.image}
                      alt={calc.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out bw-image"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Calculator Info - Overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--fg)] mb-3 group-hover:translate-y-[-4px] transition-transform duration-300">
                      {calc.title}
                    </h3>
                    {calc.subtitle && (
                      <p className="text-lg md:text-xl text-[var(--muted)] max-w-md">
                        {calc.subtitle}
                      </p>
                    )}
                    {/* Subtle arrow indicator */}
                    <div className="mt-6 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm uppercase tracking-wider">Open Calculator →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
