// ============================================
// SIMPLE Browser Console Script - Extract Products
// ============================================
// Copy and paste this ENTIRE script into browser console (F12)
// Wait for page to fully load first, then run this

(function() {
  console.log('🔍 Extracting products from HomeRun page...\n');
  
  const products = [];
  const seen = new Set();
  
  // Find all product links
  const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
  console.log(`Found ${productLinks.length} product links\n`);
  
  productLinks.forEach((link, index) => {
    try {
      const href = link.getAttribute('href');
      const slug = href.split('/products/')[1]?.split('?')[0]?.split('#')[0];
      
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      
      // Find image - try multiple locations
      let img = null;
      
      // Method 1: Image directly in the link
      img = link.querySelector('img');
      
      // Method 2: Image in parent/sibling elements
      if (!img) {
        const parent = link.closest('div, article, li, section');
        if (parent) {
          img = parent.querySelector('img');
        }
      }
      
      // Method 3: Look for lazy-loaded images
      if (!img) {
        const container = link.parentElement || link.closest('[class*="card"], [class*="product"], article');
        if (container) {
          img = container.querySelector('img[data-src], img[data-lazy-src], img[loading]');
        }
      }
      
      if (!img) {
        console.log(`⚠️  [${index + 1}] No image found: ${slug}`);
        return;
      }
      
      // Get image URL
      let imageUrl = img.src || 
                    img.dataset.src || 
                    img.dataset.lazySrc ||
                    img.dataset.originalSrc ||
                    img.getAttribute('data-src') ||
                    img.getAttribute('data-lazy-src');
      
      // Try srcset if no src
      if (!imageUrl) {
        const srcset = img.getAttribute('srcset');
        if (srcset) {
          // Get the largest image from srcset
          const sources = srcset.split(',').map(s => s.trim().split(' ')[0]);
          imageUrl = sources[sources.length - 1] || sources[0];
        }
      }
      
      if (!imageUrl) {
        console.log(`⚠️  [${index + 1}] No image URL: ${slug}`);
        return;
      }
      
      // Normalize URL
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
      }
      
      // Get high-res version (remove size constraints)
      if (imageUrl.includes('?width=')) {
        imageUrl = imageUrl.split('?')[0] + '?v=1';
      }
      
      // Skip placeholders
      if (imageUrl.includes('placeholder') || imageUrl.includes('spinner') || imageUrl.includes('loading')) {
        return;
      }
      
      // Get product name
      let productName = '';
      
      // Try heading in link
      const heading = link.querySelector('h1, h2, h3, h4, h5, [class*="title"], [class*="name"]');
      if (heading) {
        productName = heading.textContent?.trim();
      }
      
      // Try parent container
      if (!productName) {
        const container = link.closest('[class*="product"], article, [class*="card"]');
        if (container) {
          const titleEl = container.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]');
          if (titleEl) {
            productName = titleEl.textContent?.trim();
          }
        }
      }
      
      // Try image alt
      if (!productName && img.alt) {
        productName = img.alt.trim();
      }
      
      // Fallback to slug
      if (!productName) {
        productName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      productName = productName.replace(/\s+/g, ' ').trim();
      
      if (!productName) {
        console.log(`⚠️  [${index + 1}] No name: ${slug}`);
        return;
      }
      
      products.push({
        name: productName,
        slug: slug,
        imageUrl: imageUrl
      });
      
      console.log(`✓ [${index + 1}] ${productName}`);
      
    } catch (err) {
      console.error(`❌ Error on link ${index + 1}:`, err.message);
    }
  });
  
  // Remove duplicates
  const uniqueProducts = [];
  const seenSlugs = new Set();
  products.forEach(p => {
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      uniqueProducts.push(p);
    }
  });
  
  console.log(`\n✅ Extracted ${uniqueProducts.length} unique products:\n`);
  uniqueProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Image: ${p.imageUrl}\n`);
  });
  
  // Create JSON
  const jsonOutput = JSON.stringify(uniqueProducts, null, 2);
  
  console.log('📋 JSON Output:\n');
  console.log(jsonOutput);
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ ✅ ✅ COPIED TO CLIPBOARD! ✅ ✅ ✅\n');
      console.log('Now paste it into: scripts/product-data/[collection-name].json');
    }).catch(() => {
      console.log('\n⚠️  Copy failed. Please manually copy the JSON above.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above manually.');
  }
  
  // Make available globally
  window.extractedProducts = uniqueProducts;
  window.extractedProductsJSON = jsonOutput;
  
  return uniqueProducts;
})();

