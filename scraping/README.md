# Scraping Tools & Data

This folder contains all scraping-related files for the HomeRun product collections.

## 📁 Structure

```
scraping/
├── scripts/          # Extraction and download scripts
├── data/             # JSON product data files
├── images/           # Scraped product images
└── docs/             # Documentation and guides
```

## 📋 Quick Start

1. **Extract products**: Use `scripts/extract-jsonld-listitem.js` in browser console
2. **Save JSON**: Copy output to `data/[collection-name].json`
3. **Download images**: Run `node scripts/download-single-collection.js [collection-name]`

See `docs/QUICK_START.md` for detailed instructions.

## 📊 Collections Scraped

All 7 collections completed:
- ✅ Plywood, MDF & HDHMR (11 products)
- ✅ Fevicol (8 products)
- ✅ Kitchen Systems & Accessories (24 products)
- ✅ Hinges, Channels & Handles (23 products)
- ✅ Wardrobe & Bed Fittings (21 products)
- ✅ Door Locks & Hardware (15 products)
- ✅ General Hardware & Tools (12 products)

**Total: 114 products, 112 images**

## 🔧 Scripts

- `extract-jsonld-listitem.js` - Main extraction script (works perfectly!)
- `download-single-collection.js` - Download images for one collection
- `download-from-json.js` - Download images from JSON file

## 📚 Documentation

- `docs/QUICK_START.md` - Quick reference guide
- `docs/SCRAPING_INSTRUCTIONS.md` - Detailed scraping guide
- `docs/SCRAPING_CHECKLIST.md` - Progress tracker
- `docs/SCRAPED_IMAGES_README.md` - Image organization guide

## 📦 Data Files

All JSON product data is in `data/` folder. Each file contains:
- Product name
- Product slug
- Image URL

Images are organized in `images/[collection-name]/` folders.

## 🎯 Usage

### Extract Products
```javascript
// 1. Visit collection page
// 2. Open browser console
// 3. Paste scripts/extract-jsonld-listitem.js
// 4. Copy JSON output
```

### Download Images
```bash
# Download single collection
node scripts/download-single-collection.js plywood-mdf-hdhmr

# Or use download-from-json.js
node scripts/download-from-json.js
```

## 📝 Notes

- All scripts are browser console compatible
- Images are automatically renamed with product slugs
- JSON files are organized by collection name
- Total scraping completed: December 5, 2025

