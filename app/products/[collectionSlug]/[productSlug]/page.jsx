'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import collectionsMetadata from '@/data/collections-metadata.json'
import ProductImage from '@/components/ProductImage'

export default function ProductPage({ params }) {
  const unwrappedParams = use(params)
  const [product, setProduct] = useState(null)
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        // Load collection metadata
        const collectionData = collectionsMetadata.find(c => c.slug === unwrappedParams.collectionSlug)
        setCollection(collectionData)

        // Load products from collection
        const productsResponse = await fetch(`/api/collections/${unwrappedParams.collectionSlug}`)
        if (productsResponse.ok) {
          const products = await productsResponse.json()
          const productData = products.find(p => p.slug === unwrappedParams.productSlug)
          setProduct(productData)
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [unwrappedParams.collectionSlug, unwrappedParams.productSlug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <p className="text-[var(--muted)]">Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product || !collection) {
    return (
      <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--fg)]">Product Not Found</h1>
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
            <Link href={`/collections/${unwrappedParams.collectionSlug}`} className="hover:text-[var(--fg)] transition-colors">
              {collection.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--fg)]">{product.name}</span>
          </nav>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-16">
              {/* Product Image */}
              <div className="relative aspect-square bg-[var(--muted)]/10 overflow-hidden rounded-lg">
                <ProductImage
                  collectionSlug={unwrappedParams.collectionSlug}
                  productSlug={unwrappedParams.productSlug}
                  productName={product.name}
                  remoteImageUrl={product.imageUrl}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
                  {product.name}
                </h1>
                <p className="text-lg md:text-xl text-[var(--muted)] mb-8">
                  Part of the <Link href={`/collections/${unwrappedParams.collectionSlug}`} className="text-[var(--accent)] hover:underline">{collection.title}</Link> collection
                </p>

                {/* Action Buttons */}
                <div className="space-y-4 mb-12">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}&collection=${encodeURIComponent(collection.title)}`}
                    className="block w-full bg-[var(--accent)] text-[var(--bg)] px-8 py-4 text-center font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
                  >
                    Inquire About This Product
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full border border-[var(--accent)] text-[var(--accent)] px-8 py-4 text-center font-medium hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href={`/collections/${unwrappedParams.collectionSlug}`}
                    className="block w-full border border-[var(--muted)]/30 text-[var(--fg)] px-8 py-4 text-center font-medium hover:border-[var(--accent)] transition-colors duration-300 hover-scale"
                  >
                    View All {collection.title}
                  </Link>
                </div>

                {/* Product Details */}
                <div className="border-t border-[var(--muted)]/20 pt-8">
                  <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Product Information</h2>
                  <div className="space-y-3 text-[var(--muted)]">
                    <p>
                      <span className="font-medium text-[var(--fg)]">Collection:</span> {collection.title}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--fg)]">Category:</span> {collection.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            <div className="border-t border-[var(--muted)]/20 pt-16">
              <h2 className="text-3xl font-bold mb-8 text-[var(--fg)]">More from {collection.title}</h2>
              <Link
                href={`/collections/${unwrappedParams.collectionSlug}`}
                className="inline-block text-[var(--accent)] hover:underline font-medium"
              >
                View all {collection.productCount} products →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

