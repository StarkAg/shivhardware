# Stara Site - Project File Map

## Project Structure Overview

### Core App Files
- **app/page.jsx** (~30 lines) - Homepage with Hero and ProductGrid
- **app/layout.jsx** (~108 lines) - Root layout with metadata, JSON-LD, and global providers
- **app/collections/page.jsx** (~30 lines) - Collections listing page
- **app/collections/[slug]/page.jsx** (~117 lines) - Dynamic collection detail pages
- **app/about/page.jsx** (~50 lines) - About page with mission statement
- **app/contact/page.jsx** (~25 lines) - Contact page wrapper
- **app/custom/page.jsx** (~47 lines) - Custom orders page
- **app/dealer-locator/page.jsx** (~25 lines) - Dealer locator page
- **app/faq/page.jsx** (~40 lines) - FAQ page

### Components (All Client Components)
- **components/Hero.jsx** (~252 lines) - Full-screen hero with GSAP animations and parallax
- **components/ProductGrid.jsx** (~213 lines) - Responsive product grid with staggered scroll reveals
- **components/ValueProps.jsx** (~93 lines) - Three-column value propositions section
- **components/CursorFollower.jsx** (~138 lines) - Animated cursor follower with hover scale
- **components/SmoothScroll.jsx** (~20 lines) - Client wrapper for Lenis initialization
- **components/ContactForm.jsx** (~168 lines) - Contact form with API integration
- **components/DealerLocator.jsx** (~60 lines) - Dealer search and listing component

### Library/Utilities
- **lib/scroll.js** (~103 lines) - Lenis smooth scroll initialization with GSAP ScrollTrigger integration
- **lib/animations.js** (~80 lines) - GSAP animation configuration and helper functions

### API Routes
- **app/api/contact/route.js** (~25 lines) - Contact form POST endpoint (logs to console in dev)

### Configuration
- **package.json** (~28 lines) - Dependencies: Next.js 15, React 18, GSAP, Lenis, Swiper, Tailwind
- **next.config.js** (~10 lines) - Next.js configuration
- **tailwind.config.cjs** (~15 lines) - Tailwind CSS configuration
- **postcss.config.cjs** (~7 lines) - PostCSS configuration
- **jsconfig.json** (~7 lines) - Path aliases (@/*)
- **styles/globals.css** (~136 lines) - Global styles, CSS variables, utilities, black theme

### Data
- **data/dealers.json** (~22 lines) - Sample dealer data (3 dealers: Chennai, Bangalore, Mumbai)

### Public Assets
- **public/assets/hero-1.jpg** - Main hero image
- **public/assets/hero-2.jpg** - Secondary hero image
- **public/assets/hero-video-frame.jpg** - Video poster frame
- **public/assets/vid.mp4** - Hero video (needs to be renamed/used)
- **public/assets/card-1.jpg, card-2.jpg** - Product card images
- **public/assets/og-stara.jpg** - OpenGraph image
- **public/assets/cards/** - Directory for card images (empty, needs card-1.jpg, card-2.jpg, card-3.jpg)
- **public/assets/specs/** - Directory for spec PDFs (empty, needs sample-spec.pdf)

### Documentation
- **README.md** (~200+ lines) - Setup, deployment, and production checklist
- **public/assets/README.md** - Asset placement guide

## Client/Server Boundary Check

✅ **All client components properly marked:**
- components/Hero.jsx - 'use client' ✓
- components/ProductGrid.jsx - 'use client' ✓
- components/ValueProps.jsx - 'use client' ✓
- components/CursorFollower.jsx - 'use client' ✓
- components/SmoothScroll.jsx - 'use client' ✓
- components/ContactForm.jsx - 'use client' ✓
- components/DealerLocator.jsx - 'use client' ✓

✅ **Server components (no 'use client'):**
- All app/*/page.jsx files - Correctly server components
- app/layout.jsx - Correctly server component

## Potential Issues Found

1. **Missing data file:** `data/products.json` referenced in Prompt 10 but doesn't exist yet
2. **Video file:** `public/assets/vid.mp4` exists but Hero component expects `/assets/hero-video.mp4`
3. **Card images:** `public/assets/cards/` directory exists but is empty (needs card-1.jpg, card-2.jpg, card-3.jpg)
4. **Spec PDF:** `public/assets/specs/` directory exists but is empty (needs sample-spec.pdf)
5. **DealerLocator import:** Uses `@/data/dealers.json` - need to verify this works (JSON imports in Next.js)

## Import Check

✅ All components have proper imports
✅ GSAP and ScrollTrigger properly registered
✅ Next.js Image component used where appropriate
✅ Path aliases (@/*) configured in jsconfig.json

## Next Steps (Based on Prompts)

1. Wire hero media (images + video) with Swiper support
2. Create VideoHero component for better separation
3. Tune Lenis + ScrollTrigger integration
4. Add polished GSAP animations
5. Optimize media for Vercel
6. Add mobile/accessibility fallbacks
7. Create products.json for dynamic pages
8. Update SEO/OG meta tags
9. Final README updates
10. Run smoke tests

