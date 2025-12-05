'use client'

import React, { useEffect, useRef, useState, use } from 'react'
import Link from 'next/link'
import { cardStaggerReveal } from '@/lib/animations'
import collectionsMetadata from '@/data/collections-metadata.json'
import ProductImage from '@/components/ProductImage'

export default function CollectionDetailPage({ params, searchParams }) {
  const gridRef = useRef(null)
  const unwrappedParams = use(params)
  const collection = collectionsMetadata.find(c => c.slug === unwrappedParams.slug)
  
  // Load products directly from API on server side, then hydrate on client
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    
    async function loadProducts() {
      try {
        const response = await fetch(`/api/collections/${unwrappedParams.slug}`, {
          signal: controller.signal,
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          setProducts(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error loading products:', err)
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
    return () => controller.abort()
  }, [unwrappedParams.slug])

  useEffect(() => {
    if (!gridRef.current || products.length === 0) return

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
  }, [products])

  if (!collection) {
    return (
      <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--fg)]">Collection Not Found</h1>
          <Link href="/collections" className="text-[var(--accent)] hover:underline">
            Back to Collections
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--fg)] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-[var(--fg)] transition-colors">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--fg)]">{collection.title}</span>
          </nav>

          {/* Collection Header */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              {collection.title}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed">
              {collection.description}
            </p>
            <p className="mt-4 text-[var(--muted)]">
              {collection.productCount} products available
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted)]">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted)]">No products found in this collection.</p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {products.map((product, index) => {

                return (
                  <Link
                    key={product.slug || index}
                    href={`/products/${unwrappedParams.slug}/${product.slug}`}
                    className="group"
                  >
                    <article className="relative h-full overflow-hidden rounded-lg bg-[var(--muted)]/5 hover-lift">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-[var(--muted)]/10">
                        <ProductImage
                          collectionSlug={unwrappedParams.slug}
                          productSlug={product.slug}
                          productName={product.name}
                          remoteImageUrl={product.imageUrl}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Product Info */}
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold mb-2 text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="mt-4 text-sm text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="uppercase tracking-wider">View Details →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Back to Collections */}
          <div className="mt-16 text-center">
            <Link
              href="/collections"
              className="inline-block border border-[var(--muted)]/30 text-[var(--fg)] px-8 py-4 font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300 hover-scale"
            >
              ← Back to All Collections
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
