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
              // Try to get larger version
              image = image.replace(/[?&]width=\d+/g, '').replace(/[?&]height=\d+/g, '');
              if (!image.includes('?')) {
                image += '?v=1';
              }
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
  
  // Also try to match images from DOM with product names from JSON-LD
  if (products.length > 0) {
    console.log(`\n📸 Trying to find higher quality images from DOM...\n`);
    
    // Get all product images from page
    const allImages = Array.from(document.querySelectorAll('img')).filter(img => {
      const src = img.src || img.dataset.src || '';
      return (src.includes('cdn') || src.includes('shop')) && 
             !src.includes('logo') && 
             !src.includes('icon') &&
             !src.includes('banner');
    });
    
    // Try to match DOM images with products
    products.forEach((product, i) => {
      // Look for images near product links
      const productLinks = Array.from(document.querySelectorAll(`a[href*="${product.slug}"]`));
      
      productLinks.forEach(link => {
        // Find image in same container
        const container = link.closest('[class*="product"], article, li, .card');
        if (container) {
          const img = container.querySelector('img');
          if (img) {
            let imgSrc = img.src || img.dataset.src || img.dataset.lazySrc;
            
            if (imgSrc && !imgSrc.includes('placeholder')) {
              // Check if this is a higher quality image
              if (imgSrc.includes(product.slug) || 
                  img.getAttribute('alt')?.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])) {
                // Update with higher quality if found
                if (imgSrc.includes('?width=')) {
                  imgSrc = imgSrc.replace(/[?&]width=\d+/g, '').replace(/[?&]height=\d+/g, '');
                }
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
    if (!seenNames.has(p.name.toLowerCase())) {
      seenNames.add(p.name.toLowerCase());
      uniqueProducts.push(p);
    }
  });
  
  console.log(`\n✅ Extracted ${uniqueProducts.length} unique products:\n`);
  uniqueProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Slug: ${p.slug}`);
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
      console.log('Now save this to: scripts/product-data/plywood-mdf-hdhmr.json');
    }).catch(() => {
      console.log('\n⚠️  Could not copy automatically. Please copy the JSON above manually.');
    });
  } else {
    console.log('\n⚠️  Clipboard not available. Please copy the JSON above manually.');
  }
  
  // Make available globally
  window.extractedProducts = uniqueProducts;
  window.extractedProductsJSON = jsonOutput;
  
  console.log('\n💡 Tip: Access data via window.extractedProducts or window.extractedProductsJSON');
  
  return uniqueProducts;
})();

