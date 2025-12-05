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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
        {displayCollections.map((collection, index) => (
          <Link
            key={collection.id}
            href={collection.href || `/collections/${collection.slug || collection.id}`}
            className="group relative block overflow-hidden rounded-lg hover-scale"
          >
            <article
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="relative overflow-hidden rounded-lg flex flex-col"
            >
              {/* Collection Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]/10">
                <Image
                  src={collection.image || '/assets/card-1.jpg'}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={index < 4}
                  quality={90}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Collection Title - Below image */}
              <div className="p-4 bg-[var(--bg)]">
                <h3 className="text-lg md:text-xl font-bold text-[var(--fg)] text-center">
                  {collection.title}
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

