# Image Scraping Instructions

Since HomeRun uses Shopify which loads products dynamically, here's how to scrape images accurately:

## Method 1: Browser Console Extraction (Recommended)

1. **Open each collection page in your browser**
2. **Open Developer Tools (F12) → Console tab**
3. **Run this JavaScript code:**

```javascript
// Extract all products with images
const products = [];
document.querySelectorAll('a[href*="/products/"]').forEach(link => {
  const href = link.getAttribute('href');
  const slug = href.split('/products/')[1]?.split('?')[0];
  if (!slug) return;
  
  const img = link.querySelector('img') || link.closest('.product-card')?.querySelector('img');
  if (!img) return;
  
  let imageUrl = img.src || img.dataset.src || img.getAttribute('srcset')?.split(' ')[0];
  if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
  if (imageUrl.startsWith('/')) imageUrl = window.location.origin + imageUrl;
  
  const title = link.querySelector('h2, h3, .product-title')?.textContent?.trim() || 
                img.alt || slug;
  
  // Skip duplicates
  if (products.find(p => p.slug === slug)) return;
  
  products.push({
    name: title,
    slug: slug,
    imageUrl: imageUrl
  });
});

// Copy results
console.log(JSON.stringify(products, null, 2));
copy(JSON.stringify(products, null, 2));
console.log('✅ Copied to clipboard!');
```

4. **Paste the JSON output into the collection's JSON file** (see Method 2)

## Method 2: Using JSON Data Files

1. **Create JSON files** in `scripts/product-data/` for each collection:
   - `plywood-mdf-hdhmr.json`
   - `fevicol.json`
   - etc.

2. **Format:**
```json
[
  {
    "name": "Century Sainik MR 303 Plywood",
    "slug": "century-sainik-mr-303-plywood",
    "imageUrl": "https://home-run.co/cdn/shop/files/..."
  }
]
```

3. **Run the download script:**
```bash
node scripts/download-from-json.js
```

## Method 3: Manual Product Page Visit

For each product:
1. Visit the product page
2. Right-click the main product image → Copy Image Address
3. Save with the product name as filename

## Automated Script

Once you have the JSON data files, run:
```bash
node scripts/download-from-json.js
```

This will:
- Read JSON files from `scripts/product-data/`
- Download images to appropriate folders
- Rename images with product names
- Handle errors gracefully

