# Image Optimization

## Quick Start

Optimize all images in `public/scraped-images`:

```bash
npm run optimize-images
```

Or directly:

```bash
node scripts/optimize-images.js
```

## What It Does

1. **Converts to WebP**: All images are converted to WebP format for better compression
2. **Resizes**: Large images are resized to max 1200px (maintains aspect ratio)
3. **Compresses**: Images are compressed with 85% quality
4. **Backs up originals**: Original files are saved in `public/scraped-images/_originals`

## Configuration

Edit `scripts/optimize-images.js` to change:

- `MAX_DIMENSION`: Maximum width/height (default: 1200px)
- `QUALITY`: WebP quality 1-100 (default: 85)

## Results

Typical savings:
- PNG files: 85-95% size reduction
- JPG files: 30-60% size reduction
- Already optimized WebP: Skipped

## Next.js Image Optimization

The project is configured to:
- Use WebP and AVIF formats automatically
- Generate responsive image sizes
- Cache optimized images for 60 seconds
- Lazy load images below the fold

## Restoring Originals

If you need to restore original images:

```bash
cp -r public/scraped-images/_originals/* public/scraped-images/
```

