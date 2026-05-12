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
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
      >
        {displayCollections.map((collection, index) => {
          const isLastOdd = index === displayCollections.length - 1 && displayCollections.length % 2 !== 0
          return (
          <Link
            key={collection.id}
            href={collection.href || `/collections/${collection.slug || collection.id}`}
            className={`group relative block overflow-hidden rounded-lg hover-scale ${isLastOdd ? 'col-start-1 col-end-3 sm:col-start-auto sm:col-end-auto max-w-[50%] sm:max-w-none mx-auto sm:mx-0 w-full' : ''}`}
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
              <div className="p-2 md:p-4 bg-[var(--bg)]">
                <h3 className="text-sm md:text-xl font-bold text-[var(--fg)] text-center leading-tight">
                  {collection.title}
                </h3>
              </div>
            </article>
          </Link>
          )
        })}
      </div>
    </section>
  )
}

