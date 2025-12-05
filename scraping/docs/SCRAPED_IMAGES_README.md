# Scraped Images Directory

This directory contains product images scraped from HomeRun collection pages.

## Structure

```
scraped-images/
├── plywood-mdf-hdhmr/
├── fevicol/
├── kitchen-systems-accessories/
├── hinges-channels-handles/
├── wardrobe-bed-fittings/
├── door-locks-hardware/
└── general-hardware-tools/
```

## How to Scrape Images

### Quick Start

1. **Navigate to each collection page** in your browser
2. **Open Developer Console (F12)**
3. **Copy and paste the extraction script** from `scripts/extract-products.js`
4. **Copy the JSON output** to a file in `scripts/product-data/[collection-name].json`
5. **Run the download script:**
   ```bash
   node scripts/download-from-json.js
   ```

### Detailed Instructions

See `scripts/SCRAPING_INSTRUCTIONS.md` for complete instructions.

## Collection URLs

- Plywood, MDF & HDHMR: https://home-run.co/collections/plywood-mdf-hdhmr
- Fevicol: https://home-run.co/collections/fevicol
- Kitchen Systems & Accessories: https://home-run.co/collections/kitchen-systems-accessories
- Hinges, Channels & Handles: https://home-run.co/collections/hinges-channels-handles
- Wardrobe & Bed Fittings: https://home-run.co/collections/wardrobe-bed-fittings
- Door Locks & Hardware: https://home-run.co/collections/door-locks-hardware
- General Hardware & Tools: https://home-run.co/collections/general-hardware-tools

## Image Naming

Images are automatically renamed using the product name:
- Special characters removed
- Spaces replaced with hyphens
- Lowercase
- Max 100 characters

Example: `century-sainik-mr-303-plywood.jpg`

