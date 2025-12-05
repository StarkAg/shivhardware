# Quick Start - Image Scraping

## The Problem
The extraction script found **0 products** because Shopify loads products dynamically. Here's how to fix it:

## Solution: Use the Simple Script

### Step 1: Open the Collection Page
Go to: https://home-run.co/collections/plywood-mdf-hdhmr

### Step 2: Wait for Page to Load Completely
- Scroll down to load all products
- Wait 3-5 seconds for images to load
- Make sure you see all 11 products on the page

### Step 3: Open Browser Console
- Press **F12** (or right-click → Inspect)
- Click the **Console** tab

### Step 4: Copy and Paste Script
- Open the file: `scripts/extract-products-simple.js`
- **Copy the ENTIRE contents**
- Paste into the console
- Press **Enter**

### Step 5: Check Results
You should see:
```
✅ Extracted X unique products:
1. Century Sainik MR 303 Plywood
   Image: https://...
```

### Step 6: Copy JSON Output
- The JSON should be copied to clipboard automatically
- If not, manually copy the JSON output from console
- Create file: `scripts/product-data/plywood-mdf-hdhmr.json`
- Paste the JSON into that file

### Step 7: Download Images
Run:
```bash
node scripts/download-from-json.js
```

## If Script Still Finds 0 Products

Try these alternatives:

1. **Scroll to bottom of page first** - triggers lazy loading
2. **Wait longer** - some products load slowly
3. **Try different selector** - manually inspect a product link:
   ```javascript
   // In console, try:
   document.querySelectorAll('a[href*="/products/"]').length
   // Should show number > 0
   ```

4. **Manual extraction** - Right-click on product image → Copy Image Address, then create JSON manually

## Troubleshooting

**"Found 0 product links"**
- Page might not be fully loaded
- Wait and try again
- Check if products are visible on page

**"No image found"**
- Images might be lazy-loaded
- Scroll page to trigger loading
- Try the improved script: `extract-products-improved.js`

## Files Available

- `extract-products-simple.js` - **START HERE** (most reliable)
- `extract-products-improved.js` - Alternative with more methods
- `extract-products.js` - Original (updated)
- `download-from-json.js` - Downloads images from JSON files

