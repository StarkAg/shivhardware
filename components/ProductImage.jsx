'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductImage({ 
  collectionSlug, 
  productSlug, 
  productName, 
  remoteImageUrl,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
}) {
  const [imageSrc, setImageSrc] = useState(`/scraped-images/${collectionSlug}/${productSlug}.webp`)
  const [errorCount, setErrorCount] = useState(0)

  const extensions = ['webp', 'png', 'jpg', 'jpeg']
  const fallbackImage = '/assets/card-1.jpg'

  const handleError = () => {
    const currentExt = extensions[errorCount]
    
    if (errorCount < extensions.length - 1) {
      // Try next extension
      const nextExt = extensions[errorCount + 1]
      setImageSrc(`/scraped-images/${collectionSlug}/${productSlug}.${nextExt}`)
      setErrorCount(errorCount + 1)
    } else if (errorCount === extensions.length - 1 && remoteImageUrl) {
      // Try remote URL
      setImageSrc(remoteImageUrl)
      setErrorCount(errorCount + 1)
    } else {
      // Final fallback
      setImageSrc(fallbackImage)
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={productName || 'Product image'}
      fill
      className={className}
      sizes={sizes}
      onError={handleError}
      unoptimized={imageSrc.startsWith('http')}
      loading="lazy"
      quality={85}
    />
  )
}

