# Scraping Checklist

## ✅ ALL COLLECTIONS COMPLETED! 🎉

- [x] **Plywood, MDF & HDHMR** - 11 products ✅ (11 images)
- [x] **Fevicol** - 8 products ✅ (8 images)
- [x] **Kitchen Systems & Accessories** - 24 products ✅ (24 images)
- [x] **Hinges, Channels & Handles** - 23 products ✅ (21 images)
- [x] **Wardrobe & Bed Fittings** - 21 products ✅ (21 images)
- [x] **Door Locks & Hardware** - 15 products ✅ (15 images)
- [x] **General Hardware & Tools** - 12 products ✅ (12 images)

**Total: 112 images across 7 collections**

## Quick Steps for Each Collection

1. **Visit collection page**
2. **Open browser console** (F12 → Console tab)
3. **Copy script**: Open `scripts/extract-jsonld-listitem.js` and copy entire contents
4. **Paste in console** and press Enter
5. **Copy JSON output** from console
6. **Save JSON**: Create file in `scripts/product-data/[collection-name].json` and paste JSON
7. **Download images**: Run `node scripts/download-from-json.js`

## Images Location

All downloaded images are saved to:
- `public/scraped-images/[collection-name]/`

## Scripts Used

- **Extraction**: `scripts/extract-jsonld-listitem.js` (works perfectly!)
- **Download**: `scripts/download-from-json.js` (downloads all images)

