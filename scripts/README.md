# Image Scraping Scripts

This directory contains tools for scraping product images from HomeRun collection pages.

## Files

- `extract-products.js` - Browser console script to extract product data from pages
- `download-from-json.js` - Downloads images using JSON product data
- `SCRAPING_INSTRUCTIONS.md` - Detailed instructions

## Quick Start

1. Visit a collection page (e.g., https://home-run.co/collections/plywood-mdf-hdhmr)
2. Open browser console (F12)
3. Copy/paste contents of `extract-products.js`
4. Copy the JSON output
5. Save to `product-data/[collection-name].json`
6. Run: `node download-from-json.js`

## Directory Structure

```
scripts/
├── extract-products.js       # Browser console extraction script
├── download-from-json.js     # Image download script
├── product-data/             # JSON files with product data
│   ├── plywood-mdf-hdhmr.json
│   ├── fevicol.json
│   └── ...
└── SCRAPING_INSTRUCTIONS.md  # Detailed guide
```

## Example JSON Format

```json
[
  {
    "name": "Century Sainik MR 303 Plywood",
    "slug": "century-sainik-mr-303-plywood",
    "imageUrl": "https://home-run.co/cdn/shop/files/image.jpg"
  }
]
```
