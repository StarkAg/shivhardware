# Shiv Hardware Store

A modern e-commerce website for Shiv Hardware Store, built with Next.js 15. Features product collections, pricing calculators for aluminium doors and windows, and a complete shopping experience.

🌐 **Live Site**: [https://shiv-hardware-store.vercel.app](https://shiv-hardware-store.vercel.app)  
📦 **Repository**: [https://github.com/StarkAg/shivhardware](https://github.com/StarkAg/shivhardware)

## Features

- 🛍️ **E-commerce Product Catalog** - Browse 7 collections with 100+ products
- 🧮 **Pricing Calculators** - Calculate costs for aluminium doors and windows
- 🎨 **Modern UI/UX** - Smooth scrolling, GSAP animations, custom cursor
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ⚡ **Performance Optimized** - WebP images, lazy loading, Next.js optimization
- 🔍 **SEO Friendly** - Meta tags, structured data, sitemap ready

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library with ScrollTrigger
- **Lenis** - Smooth scroll library
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Project Structure

```
shiv-hardware-store/
├── app/                    # Next.js App Router pages
│   ├── collections/        # Product collection pages
│   ├── products/           # Individual product pages
│   ├── calculators/        # Pricing calculator pages
│   └── ...
├── components/             # React components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── ProductGrid.jsx
│   └── ...
├── data/                   # Product data and collections
│   ├── collections/       # Collection JSON files
│   └── collections-metadata.json
├── lib/                    # Utility functions
│   ├── calculators.ts     # Calculator logic
│   └── animations.js      # GSAP animations
├── public/                 # Static assets
│   ├── scraped-images/    # Product images (WebP optimized)
│   └── assets/            # Site assets
└── scripts/               # Utility scripts
    └── optimize-images.js # Image optimization script
```

## Product Collections

1. **Plywood, MDF & HDHMR** - Construction boards and panels
2. **Fevicol Adhesives** - Industrial adhesives and sealants
3. **Kitchen Systems & Accessories** - Modular kitchen hardware
4. **Hinges, Channels & Handles** - Furniture and door hardware
5. **Wardrobe & Bed Fittings** - Storage and bed mechanisms
6. **Door Locks & Hardware** - Security and door fittings
7. **General Hardware & Tools** - Essential tools and hardware

## Calculators

- **Aluminium Door Calculator** - Calculate costs for custom aluminium doors
- **2-Track Window Calculator** - Estimate pricing for 2-track windows
- **3-Track Window Calculator** - Estimate pricing for 3-track windows

## Image Optimization

Optimize product images for faster loading:

```bash
npm run optimize-images
```

This script:
- Converts images to WebP format
- Resizes large images to max 1200px
- Compresses with 85% quality
- Reduces file sizes by 50-95%

## Deployment

The site is deployed on Vercel with automatic deployments from GitHub.

### Manual Deployment

1. Push to GitHub: `git push origin main`
2. Vercel automatically builds and deploys
3. Site available at: `https://shiv-hardware-store.vercel.app`

## Environment Variables

No environment variables required for basic functionality.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run optimize-images` - Optimize product images

## Business Information

**Shiv Hardware Store**  
📍 Ramgarh Cantonment, Ramgarh, Jharkhand, India  
📞 Phone: [080928 50954](tel:+918092850954)  
📧 Email: [info@shivhardware.com](mailto:info@shivhardware.com)  
🕐 Hours: 10:30 AM - 7:00 PM (Closed Tuesdays)

## License

Private - All rights reserved

## Support

For issues or questions, please contact us at [info@shivhardware.com](mailto:info@shivhardware.com)
