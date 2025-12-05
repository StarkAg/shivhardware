// ============================================
// Browser Console Script - Extract Products
// ============================================
// Copy and paste this ENTIRE script into browser console (F12)
// Make sure the page is fully loaded first!

(function() {
  console.log('🔍 Extracting products from HomeRun page...\n');
  
  const products = [];
  const seen = new Set();
  
  // Wait a moment for dynamic content
  console.log('Scanning page for products...\n');
  
  // Method 1: Find product links
  const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
  console.log(`Found ${productLinks.length} product links\n`);
  
  productLinks.forEach((link, index) => {
    try {
      const href = link.getAttribute('href');
      const slug = href.split('/products/')[1]?.split('?')[0];
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      
      // Find image - try multiple methods
      let img = link.querySelector('img');
      
      // Try parent container
      if (!img) {
        const container = link.closest('div, article, li, section');
        if (container) {
          img = container.querySelector('img');
        }
      }
      
      // Try lazy-loaded images
      if (!img) {
        const container = link.parentElement || link.closest('[class*="product"], [class*="card"]');
        if (container) {
          img = container.querySelector('img[data-src], img[data-lazy-src], img[loading]');
        }
      }
      
      if (!img) {
        console.log(`⚠️  [${index + 1}] No image: ${slug}`);
        return;
      }
      
      // Get image URL - try multiple attributes
      let imageUrl = img.src || 
                    img.dataset.src || 
                    img.dataset.lazySrc ||
                    img.dataset.originalSrc ||
                    img.getAttribute('data-src') ||
                    img.getAttribute('data-lazy-src');
      
      // Try srcset
      if (!imageUrl) {
        const srcset = img.getAttribute('srcset');
        if (srcset) {
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
      
      // Skip placeholders
      if (imageUrl.includes('placeholder') || imageUrl.includes('no-image') || imageUrl.includes('blank')) {
        return;
      }
      
      // Get product name
      const titleElement = link.querySelector('h2, h3, .product-title, .card__heading') ||
                          link.closest('.product-card, .card-product')?.querySelector('h2, h3, .product-title');
      
      const productName = titleElement?.textContent?.trim() || 
                         img.alt?.trim() || 
                         slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      products.push({
        name: productName,
        slug: slug,
        imageUrl: imageUrl
      });
      
    } catch (err) {
      console.error('Error processing link:', err);
    }
  });
  
  // Method 2: Try JSON-LD structured data
  if (products.length === 0) {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
          data.itemListElement.forEach(item => {
            if (item.item && item.item['@type'] === 'Product') {
              const product = item.item;
              const name = product.name;
              let image = product.image;
              
              if (Array.isArray(image)) {
                image = image[0];
              }
              
              if (typeof image === 'object') {
                image = image.url || image.contentUrl;
              }
              
              if (name && image && !seen.has(name)) {
                seen.add(name);
                products.push({
                  name: name,
                  slug: product.url?.split('/products/')[1]?.split('?')[0] || name.toLowerCase().replace(/\s+/g, '-'),
                  imageUrl: image
                });
              }
            }
          });
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
  }
  
  // Output results
  console.log(`\n✅ Found ${products.length} products:\n`);
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   URL: ${p.imageUrl}`);
  });
  
  // Create JSON output
  const jsonOutput = JSON.stringify(products, null, 2);
  console.log(`\n📋 JSON Output (copied to clipboard):\n`);
  console.log(jsonOutput);
  
  // Try to copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ Copied to clipboard!');
    }).catch(() => {
      console.log('\n⚠️  Could not copy to clipboard automatically. Please copy the JSON above.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above.');
  }
  
  // Make it available globally
  window.extractedProducts = products;
  
  return products;
})();

