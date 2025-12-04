# Stara Site

A modern Next.js 15 website built with App Router, featuring smooth scrolling, GSAP animations, and a black & white design theme.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library with ScrollTrigger
- **Lenis** - Smooth scroll library
- **Swiper** - Touch slider library

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

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

Start the production server (after building):

```bash
npm run start
```

## Project Structure

```
stara-site/
├── app/                    # Next.js App Router pages
│   ├── layout.jsx         # Root layout with metadata
│   └── page.jsx           # Home page
├── components/            # React components
│   ├── CursorFollower.jsx
│   ├── Hero.jsx
│   ├── ProductGrid.jsx
│   └── SmoothScroll.jsx
├── lib/                   # Utility functions
│   └── scroll.js          # Lenis scroll initialization
├── public/                # Static assets
│   └── assets/
│       ├── images/        # Image assets
│       └── videos/        # Video assets
├── styles/                # Global styles
│   └── globals.css        # Tailwind & custom CSS
└── package.json
```

## Assets

### Image & Video Placement

Place all assets in the `/public/assets` directory:

- **Images**: `/public/assets/images/`
  - Hero images, product cards, OpenGraph images, etc.
  - Supported formats: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`, `.gif`, `.avif`

- **Videos**: `/public/assets/videos/`
  - Hero videos, background videos, etc.
  - Supported formats: `.mp4`, `.webm`, `.ogg`

### Required Assets

Before deploying to production, replace these placeholder assets:

- `/public/assets/images/card-1.jpg` - Product card placeholder
- `/public/assets/images/og-stara.jpg` - OpenGraph image (1200x630px recommended)
- `/public/assets/videos/hero-video.mp4` - Hero video placeholder

### Asset Usage

Reference assets in your code using the `/assets/` path:

```jsx
// Images
<Image src="/assets/images/your-image.jpg" alt="Description" />

// Videos
<video src="/assets/videos/your-video.mp4" />
```

## Deployment to Vercel

### Step 1: Connect Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your repository

### Step 2: Configure Project Settings

1. **Framework Preset**: Select `Next.js`
2. **Build Command**: `npm run build` (default, but verify)
3. **Output Directory**: `next` (Next.js default)
4. **Install Command**: `npm install` (default)

### Step 3: Environment Variables

No special environment variables are needed for a static demo. If you add API keys or other secrets later, add them in the Vercel dashboard under "Environment Variables".

### Step 4: Advanced Settings

#### Image Optimization

Enable Next.js Image Optimization in Vercel:

1. Go to Project Settings → General
2. Ensure "Image Optimization" is enabled (enabled by default)
3. For custom image domains, add them in `next.config.js`:

```js
images: {
  domains: ['your-cdn-domain.com'],
}
```

#### Analytics

- **Next.js Analytics**: Disable if not using (Project Settings → Analytics)
- Consider using Vercel Analytics for performance insights

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your site
3. Your site will be available at `your-project.vercel.app`

### Post-Deployment

1. Update canonical URLs in `app/layout.jsx` with your production domain
2. Update OpenGraph image URL if using absolute URLs
3. Verify all assets are loading correctly
4. Test smooth scroll and animations on production

## Customization

### Theme Colors

Edit CSS variables in `styles/globals.css`:

```css
:root {
  --bg: #0b0b0b;      /* Black background */
  --fg: #ffffff;      /* White text */
  --muted: #999;      /* Gray for secondary text */
  --accent: #ffffff;   /* White for accents/buttons */
}
```

### Smooth Scroll Settings

Adjust Lenis scroll behavior in `lib/scroll.js`:

- **Duration**: Lower (1.0-1.5) = faster, Higher (1.5-2.5) = slower
- **Easing**: Modify the easing function for different scroll feels

### GSAP Animations

Animation settings can be adjusted in `lib/animations.js`:
- `heroIntro()` - Hero title/subtitle/CTA animations with mask reveal
- `heroParallax()` - Background media parallax effect
- `cardStaggerReveal()` - Staggered product card reveals

All animations respect `prefers-reduced-motion` and work with/without Lenis.

## Animation Configuration

### Tuning Animations

Edit `/lib/animations.js` to adjust:
- Default duration and easing
- Stagger delays
- ScrollTrigger start positions
- Parallax intensity

### Disable Lenis on Mobile

Lenis is automatically disabled on screens < 700px. To change this threshold, edit `lib/animations.js`:

```js
export function shouldDisableLenis() {
  return window.innerWidth < 700 // Change this value
}
```

### Debug ScrollTrigger

To see ScrollTrigger markers during development, set in `lib/animations.js`:

```js
export const DEBUG_SCROLL_TRIGGERS = true
```

## Media Optimization Tips

### Images
- Compress images to 80% quality before adding
- Use WebP format for better compression
- Hero images: minimum 1920px width
- Product cards: 4:3 aspect ratio recommended
- OG image: 1200x630px (1.91:1 ratio)

### Videos
- Use MP4 format (H.264 codec)
- Keep file sizes < 10MB if possible
- For videos > 10MB, host on CDN (S3/Cloudflare) and use URL
- Always include poster image for fallback

### Next.js Image Optimization
- Images use Next.js `<Image>` component by default
- `unoptimized` flag is set for local development
- Remove `unoptimized` for production to enable optimization
- Add custom domains in `next.config.js` if using remote images

## Production Checklist

Before going live:

- [ ] Replace all placeholder images in `/public/assets/`:
  - [ ] `/public/assets/hero-1.jpg`, `/public/assets/hero-2.jpg`
  - [ ] `/public/assets/cards/card-1.jpg`, `card-2.jpg`, `card-3.jpg`
  - [ ] `/public/assets/og-stara.jpg`
  - [ ] `/public/assets/logo-stara.png`
- [ ] Replace hero video placeholder (`/public/assets/hero-video.mp4`)
- [ ] Update metadata in `app/layout.jsx`:
  - [ ] Canonical URLs (replace `https://stara.com` with actual domain)
  - [ ] Organization contact info in JSON-LD (phone, area served)
  - [ ] Logo URL in JSON-LD
- [ ] Update dealer data in `/data/dealers.json` with real dealer information
- [ ] Test all animations and interactions
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Optimize images (compress, use WebP where possible)
- [ ] Test on Vercel preview deployment
- [ ] Configure contact form API route to send emails (currently logs to console)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

[Add your license here]

## Support

For issues or questions, please [create an issue](https://github.com/your-repo/issues).

