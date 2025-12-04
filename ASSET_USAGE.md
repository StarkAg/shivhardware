# Asset Usage Map

This document shows where each asset in `/public/assets/` is being used across the site.

## Hero Images

- **hero-1.jpg** - Used in:
  - Homepage hero (first slide in carousel)
  - About page hero
  - Fallback for single image hero

- **hero-2.jpg** - Used in:
  - Collections page hero
  - Homepage hero (third slide in carousel)

- **hero-video-frame.jpg** - Used in:
  - Video poster/fallback for hero video
  - Fallback when video autoplay is blocked

## Video

- **vid.mp4** - Used in:
  - Homepage hero (second slide in carousel)
  - Single video hero option

## Product Cards

- **card-1.jpg** - Used in:
  - Modern Series product card
  - WeatherGuard product card
  - Slimline Flush product card
  - Fallback for product images

- **card-2.jpg** - Used in:
  - Heritage Series product card
  - Acoustic Series product card
  - Custom Atelier product card

## Background Textures

- **bg-linen.jpg** - Used in:
  - ValueProps section (subtle background texture)
  - Dealer Locator page (background texture)

- **texture-wood-1.jpg** - Used in:
  - About page (background texture)
  - ValueProps cards (alternating decorative texture)
  - Custom Orders page (background texture)
  - Collection detail pages (image overlay)

- **texture-stone-1.jpg** - Used in:
  - ValueProps cards (alternating decorative texture)
  - Contact page (background texture)
  - FAQ page (background texture)

## Showroom

- **showroom-1.jpg** - Used in:
  - About page hero image

## SEO/Branding

- **og-stara.jpg** - Used in:
  - OpenGraph meta tags (all pages)
  - Twitter card meta tags
  - Social media sharing preview

## Image Optimization Notes

All images use:
- Next.js `<Image>` component for optimization
- `bw-image` class for grayscale filter (black & white theme)
- `unoptimized` flag (can be removed for production)
- Proper `alt` attributes for accessibility
- Responsive `sizes` attribute for performance

## Video Optimization

- Video uses `preload="metadata"` to reduce initial load
- Poster image (`hero-video-frame.jpg`) shown if autoplay blocked
- Muted, loop, playsInline for maximum compatibility
- Fallback to poster image if video fails to load

