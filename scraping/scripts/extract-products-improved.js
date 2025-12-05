// ============================================
// IMPROVED Browser Console Script - Extract Products
// ============================================
// Copy and paste this entire script into your browser console
// on each HomeRun collection page, then copy the output JSON

(function() {
  console.log('🔍 Extracting products from page...');
  console.log('   Waiting for products to load...\n');
  
  const products = [];
  const seen = new Set();
  
  // Wait a bit for dynamic content to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Method 1: Look for product grid items (Shopify common patterns)
  const productSelectors = [
    '.product-item',
    '.product-card',
    '.card-product',
    '[class*="product"]',
    'article',
    '.grid__item',
    'li[class*="product"]'
  ];
  
  let productElements = [];
  for (const selector of productSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`   Found ${elements.length} elements with selector: ${selector}`);
      productElements = Array.from(elements);
      break;
    }
  }
  
  // Method 2: Find all links to product pages
  const productLinks = document.querySelectorAll('a[href*="/products/"]');
  console.log(`   Found ${productLinks.length} product links`);
  
  // Process product links
  productLinks.forEach((link, index) => {
    try {
      const href = link.getAttribute('href');
      const slug = href.split('/products/')[1]?.split('?')[0]?.split('#')[0];
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      
      // Find the product container
      const productContainer = link.closest('[class*="product"], article, li, .card, .grid__item') || link.parentElement;
      
      // Find image - try multiple methods
      let img = link.querySelector('img');
      if (!img) {
        img = productContainer?.querySelector('img');
      }
      if (!img) {
        // Look for lazy-loaded images
        img = productContainer?.querySelector('img[data-src], img[data-lazy], img[loading="lazy"]');
      }
      if (!img) {
        // Look in the link's parent or siblings
        const parent = link.parentElement;
        img = parent?.querySelector('img') || parent?.previousElementSibling?.querySelector('img');
      }
      
      if (!img) {
        console.log(`   ⚠️  No image found for product: ${slug}`);
        return;
      }
      
      // Get image URL - try multiple attributes
      let imageUrl = img.src || 
                    img.dataset.src || 
                    img.dataset.originalSrc ||
                    img.dataset.lazySrc ||
                    img.getAttribute('data-lazy-src') ||
                    img.getAttribute('data-original');
      
      // Try srcset
      if (!imageUrl) {
        const srcset = img.getAttribute('srcset');
        if (srcset) {
          imageUrl = srcset.split(',')[0]?.trim().split(' ')[0];
        }
      }
      
      // Try background-image style
      if (!imageUrl) {
        const bgImage = img.style.backgroundImage || window.getComputedStyle(img).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          imageUrl = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
        }
      }
      
      if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
        console.log(`   ⚠️  Invalid image URL for product: ${slug}`);
        return;
      }
      
      // Normalize URL
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
      }
      
      // Remove query parameters that might resize the image (keep original size)
      if (imageUrl.includes('?width=') || imageUrl.includes('&width=')) {
        imageUrl = imageUrl.split('?')[0] + '?v=' + Date.now();
      }
      
      // Skip placeholders
      if (imageUrl.includes('placeholder') || imageUrl.includes('no-image') || imageUrl.includes('blank') || imageUrl.includes('spinner')) {
        return;
      }
      
      // Get product name - try multiple methods
      let productName = '';
      
      // Try heading elements
      const heading = link.querySelector('h1, h2, h3, h4, .product-title, .card__heading, [class*="title"]') ||
                     productContainer?.querySelector('h1, h2, h3, h4, .product-title, .card__heading, [class*="title"]');
      
      if (heading) {
        productName = heading.textContent?.trim();
      }
      
      // Try image alt
      if (!productName && img.alt) {
        productName = img.alt.trim();
      }
      
      // Try slug as fallback
      if (!productName) {
        productName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      // Clean product name
      productName = productName.replace(/\s+/g, ' ').trim();
      
      if (!productName) {
        console.log(`   ⚠️  No name found for product: ${slug}`);
        return;
      }
      
      products.push({
        name: productName,
        slug: slug,
        imageUrl: imageUrl
      });
      
      console.log(`   ✓ ${productName}`);
      
    } catch (err) {
      console.error(`   ❌ Error processing product ${index + 1}:`, err.message);
    }
  });
  
  // Method 3: Try JSON-LD structured data (Shopify uses this)
  if (products.length === 0) {
    console.log('   Trying JSON-LD structured data...');
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      try {
        const jsonText = script.textContent;
        let data = JSON.parse(jsonText);
        
        // Handle arrays
        if (Array.isArray(data)) {
          data = data.find(item => item['@type'] === 'ItemList') || data[0];
        }
        
        if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
          data.itemListElement.forEach((item, index) => {
            try {
              const product = item.item || item;
              if (product['@type'] === 'Product' || product.type === 'product') {
                const name = product.name;
                let image = product.image;
                
                if (Array.isArray(image)) {
                  image = image[0];
                }
                
                if (typeof image === 'object' && image !== null) {
                  image = image.url || image.contentUrl || image['@id'];
                }
                
                if (!image || typeof image !== 'string') return;
                
                // Normalize image URL
                if (image.startsWith('//')) {
                  image = 'https:' + image;
                } else if (image.startsWith('/')) {
                  image = window.location.origin + image;
                }
                
                const slug = product.url?.split('/products/')[1]?.split('?')[0] || 
                            name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                
                if (name && image && slug && !seen.has(slug)) {
                  seen.add(slug);
                  products.push({
                    name: name,
                    slug: slug,
                    imageUrl: image
                  });
                  console.log(`   ✓ ${name} (from JSON-LD)`);
                }
              }
            } catch (e) {
              // Skip invalid items
            }
          });
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
  }
  
  // Remove duplicates based on slug
  const uniqueProducts = [];
  const seenSlugs = new Set();
  products.forEach(p => {
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      uniqueProducts.push(p);
    }
  });
  
  // Output results
  console.log(`\n✅ Found ${uniqueProducts.length} unique products:\n`);
  uniqueProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Image: ${p.imageUrl}`);
  });
  
  // Create JSON output
  const jsonOutput = JSON.stringify(uniqueProducts, null, 2);
  console.log(`\n📋 JSON Output:\n`);
  console.log(jsonOutput);
  
  // Try to copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ Copied to clipboard!');
    }).catch(() => {
      console.log('\n⚠️  Could not copy to clipboard automatically. Please copy the JSON above.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above manually.');
  }
  
  // Make it available globally for manual copying
  window.extractedProducts = uniqueProducts;
  window.extractedProductsJSON = jsonOutput;
  
  console.log('\n💡 Tip: You can also access the data via:');
  console.log('   - window.extractedProducts (array)');
  console.log('   - window.extractedProductsJSON (JSON string)');
  
  return uniqueProducts;
})();

