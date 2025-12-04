'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ValueProps() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean)
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const props = [
    {
      title: 'Craftsmanship',
      description: 'Each door is milled, finished and inspected by artisans using time-tested joinery. We honor traditional techniques while embracing modern precision.',
    },
    {
      title: 'Materials',
      description: 'Engineered cores, marine-grade veneer options, and high-performance finishes for every climate. We source materials that stand the test of time.',
    },
    {
      title: 'Heritage',
      description: 'Stara began as a family workshop and grew into a brand that combines local craft with modern manufacturing. Every door carries this legacy forward.',
    },
  ]

  return (
    <section 
      ref={sectionRef}
      className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden"
    >
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/assets/bg-linen.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
            Doors for life, made with craft
          </h2>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            We believe doors are more than panels and hinges. They are thresholds, statements, and the first impression of your space. 
            Every Stara door is engineered for longevity, finished for beauty, and installed for performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {props.map((prop, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--fg)]">
                {prop.title}
              </h3>
              <p className="text-[var(--muted)] leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

