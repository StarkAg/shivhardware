// ============================================
// EXTRACT FROM JSON-LD (Most Reliable!)
// ============================================
// This script extracts products from JSON-LD structured data
// Run this in browser console on the HomeRun collection page

(function() {
  console.log('🔍 Extracting products from JSON-LD data...\n');
  
  const products = [];
  
  // Find all JSON-LD scripts
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`Found ${jsonLdScripts.length} JSON-LD scripts\n`);
  
  jsonLdScripts.forEach((script, scriptIndex) => {
    try {
      const jsonText = script.textContent;
      let data = JSON.parse(jsonText);
      
      // Handle arrays
      if (Array.isArray(data)) {
        data = data.find(item => item['@type'] === 'ItemList') || data[0];
      }
      
      // Look for ItemList
      if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
        console.log(`✓ Found ItemList in script ${scriptIndex + 1} with ${data.itemListElement.length} products\n`);
        
        data.itemListElement.forEach((item, index) => {
          try {
            const product = item.item || item;
            
            if (!product || (product['@type'] !== 'Product' && product.type !== 'product')) {
              return;
            }
            
            const name = product.name;
            if (!name) return;
            
            // Get image - handle different formats
            let image = product.image;
            
            if (Array.isArray(image)) {
              image = image[0];
            }
            
            if (typeof image === 'object' && image !== null) {
              image = image.url || image.contentUrl || image['@id'];
            }
            
            if (!image || typeof image !== 'string') {
              console.log(`⚠️  [${index + 1}] No image for: ${name}`);
              return;
            }
            
            // Normalize image URL
            if (image.startsWith('//')) {
              image = 'https:' + image;
            } else if (image.startsWith('/')) {
              image = window.location.origin + image;
            }
            
            // Get slug from URL
            const productUrl = product.url || item.url || '';
            const slug = productUrl.split('/products/')[1]?.split('?')[0]?.split('#')[0] || 
                        name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            
            // Get high-res image (remove size constraints if present)
            if (image.includes('?width=') || image.includes('&width=')) {
              // Try to get larger version - remove width/height params
              image = image.split('?')[0] + (image.includes('?v=') ? '?' : '?') + 'v=1';
            }
            
            products.push({
              name: name.trim(),
              slug: slug,
              imageUrl: image
            });
            
            console.log(`✓ [${index + 1}] ${name}`);
            
          } catch (err) {
            console.error(`❌ Error processing product ${index + 1}:`, err.message);
          }
        });
      }
    } catch (e) {
      // Skip invalid JSON
    }
  });
  
  // Also try to find better quality images from DOM
  if (products.length > 0) {
    console.log(`\n📸 Enhancing images from DOM...\n`);
    
    // Get product grid container
    const productGrid = document.querySelector('.product-grid, [class*="product-grid"]');
    
    products.forEach((product, i) => {
      // Find product links matching this slug
      const productLinks = Array.from(document.querySelectorAll(`a[href*="${product.slug}"]`));
      
      productLinks.forEach(link => {
        // Find image in the product container
        const container = link.closest('[class*="product"], article, li, .card, .grid__item');
        if (container) {
          const img = container.querySelector('img:not([src*="logo"]):not([src*="icon"]):not([src*="banner"])');
          if (img) {
            let imgSrc = img.src || img.dataset.src || img.dataset.lazySrc || img.getAttribute('data-src');
            
            if (imgSrc && !imgSrc.includes('placeholder')) {
              // Normalize
              if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
              if (imgSrc.startsWith('/')) imgSrc = window.location.origin + imgSrc;
              
              // Remove size constraints for better quality
              if (imgSrc.includes('?width=')) {
                imgSrc = imgSrc.split('?')[0] + '?v=1';
              }
              
              // Update if this looks like a product image
              if (imgSrc.includes('cdn') || imgSrc.includes('shop')) {
                product.imageUrl = imgSrc;
              }
            }
          }
        }
      });
    });
  }
  
  // Remove duplicates
  const uniqueProducts = [];
  const seenNames = new Set();
  
  products.forEach(p => {
    const key = p.name.toLowerCase().trim();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueProducts.push(p);
    }
  });
  
  console.log(`\n✅ Extracted ${uniqueProducts.length} unique products:\n`);
  uniqueProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Image: ${p.imageUrl}\n`);
  });
  
  // Create JSON output
  const jsonOutput = JSON.stringify(uniqueProducts, null, 2);
  
  console.log('📋 JSON Output:\n');
  console.log(jsonOutput);
  
  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ ✅ ✅ COPIED TO CLIPBOARD! ✅ ✅ ✅\n');
      console.log('💾 Save this to: scripts/product-data/plywood-mdf-hdhmr.json');
      console.log('   Then run: node scripts/download-from-json.js');
    }).catch(() => {
      console.log('\n⚠️  Could not copy automatically. Please copy the JSON above manually.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above manually.');
  }
  
  // Make available globally
  window.extractedProducts = uniqueProducts;
  window.extractedProductsJSON = jsonOutput;
  
  return uniqueProducts;
})();

