'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cardStaggerReveal } from '@/lib/animations'
import productsData from '@/data/products.json'

/**
 * CollectionShowcase Component
 * 
 * Editorial-style showcase of door collections - brand-focused, not e-commerce
 * Large images, minimal text, emphasis on craft and design
 */
export default function CollectionShowcase({ collections = [] }) {
  const gridRef = useRef(null)
  const cardsRef = useRef([])

  // Use collections from data file if no collections prop provided
  const displayCollections = collections.length > 0 
    ? collections 
    : productsData.map(c => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        image: c.image,
        href: c.href,
      }))

  useEffect(() => {
    if (!gridRef.current) return

    // Add .card class to articles for animation targeting
    const articles = gridRef.current.querySelectorAll('article')
    articles.forEach((article) => {
      article.classList.add('card')
    })

    // Use polished cardStaggerReveal animation
    const trigger = cardStaggerReveal(gridRef.current)

    return () => {
      if (trigger) {
        trigger.kill()
      }
    }
  }, [displayCollections])

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-0"
      >
        {displayCollections.map((collection, index) => (
          <Link
            key={collection.id}
            href={collection.href || `/collections/${collection.slug || collection.id}`}
            className="group relative block overflow-hidden hover-scale"
          >
            <article
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="relative h-[70vh] min-h-[500px] overflow-hidden"
            >
              {/* Collection Image - Full bleed */}
              <div className="absolute inset-0">
                <Image
                  src={collection.image || '/assets/card-1.jpg'}
                  alt={collection.title}
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

              {/* Collection Info - Overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--fg)] mb-3 group-hover:translate-y-[-4px] transition-transform duration-300">
                  {collection.title}
                </h3>
                {collection.subtitle && (
                  <p className="text-lg md:text-xl text-[var(--muted)] max-w-md">
                    {collection.subtitle}
                  </p>
                )}
                {/* Subtle arrow indicator */}
                <div className="mt-6 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm uppercase tracking-wider">Explore →</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

