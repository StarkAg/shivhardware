// ============================================
// EXTRACT FROM JSON-LD (FIXED VERSION)
// ============================================
// This script extracts products from JSON-LD structured data
// Handles different JSON-LD formats

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
        data = data.find(item => item['@type'] === 'ItemList' || item['@type'] === 'CollectionPage') || data[0];
      }
      
      // Look for ItemList
      if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
        console.log(`✓ Found ItemList in script ${scriptIndex + 1} with ${data.itemListElement.length} products\n`);
        
        data.itemListElement.forEach((item, index) => {
          try {
            // The product might be in item.item or directly in item
            let product = item.item || item;
            
            // Skip if not a product
            if (!product) return;
            
            // Check if it's a product (might not have @type)
            const isProduct = product['@type'] === 'Product' || 
                            product.type === 'product' ||
                            product.name || 
                            (item.position && product.url);
            
            if (!isProduct) {
              console.log(`⚠️  [${index + 1}] Skipping - not a product:`, product['@type'] || 'no type');
              return;
            }
            
            const name = product.name;
            if (!name) {
              console.log(`⚠️  [${index + 1}] No name found`);
              return;
            }
            
            // Get image - handle many different formats
            let image = product.image;
            
            // Array of images
            if (Array.isArray(image)) {
              image = image[0];
            }
            
            // Object with url/contentUrl
            if (typeof image === 'object' && image !== null) {
              image = image.url || image.contentUrl || image['@id'] || image.src;
            }
            
            // String URL
            if (typeof image === 'string') {
              // Good, we have the image URL
            } else {
              console.log(`⚠️  [${index + 1}] No image for: ${name}`);
              // Try to get from DOM later
              image = null;
            }
            
            // Normalize image URL
            if (image) {
              if (image.startsWith('//')) {
                image = 'https:' + image;
              } else if (image.startsWith('/')) {
                image = window.location.origin + image;
              }
              
              // Remove size constraints for better quality
              if (image.includes('?width=')) {
                image = image.split('?')[0] + '?v=1';
              }
            }
            
            // Get slug from URL
            const productUrl = product.url || item.url || product['@id'] || '';
            const slug = productUrl.toString().split('/products/')[1]?.split('?')[0]?.split('#')[0] || 
                        name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            
            products.push({
              name: name.trim(),
              slug: slug,
              imageUrl: image || '' // Will try to find from DOM if empty
            });
            
            console.log(`✓ [${index + 1}] ${name}${image ? '' : ' (no image yet)'}`);
            
          } catch (err) {
            console.error(`❌ Error processing item ${index + 1}:`, err.message);
            console.error(err);
          }
        });
      }
    } catch (e) {
      console.error(`Error parsing script ${scriptIndex + 1}:`, e.message);
    }
  });
  
  // Now try to find images from DOM for products without images
  if (products.length > 0) {
    console.log(`\n📸 Finding images from DOM for ${products.length} products...\n`);
    
    products.forEach((product, i) => {
      // If no image from JSON-LD, try DOM
      if (!product.imageUrl) {
        // Find product links
        const productLinks = Array.from(document.querySelectorAll(`a[href*="${product.slug}"]`));
        
        productLinks.forEach(link => {
          // Find image in container
          const container = link.closest('[class*="product"], article, li, .card, .grid__item');
          if (container) {
            const img = container.querySelector('img:not([src*="logo"]):not([src*="icon"]):not([src*="banner"])');
            if (img) {
              let imgSrc = img.src || img.dataset.src || img.dataset.lazySrc || img.getAttribute('data-src');
              
              if (imgSrc) {
                if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
                if (imgSrc.startsWith('/')) imgSrc = window.location.origin + imgSrc;
                
                // Remove size constraints
                if (imgSrc.includes('?width=')) {
                  imgSrc = imgSrc.split('?')[0] + '?v=1';
                }
                
                product.imageUrl = imgSrc;
                console.log(`  📷 Found image for: ${product.name}`);
              }
            }
          }
        });
      }
    });
  }
  
  // Remove duplicates and filter out products without images
  const uniqueProducts = [];
  const seenNames = new Set();
  
  products.forEach(p => {
    const key = p.name.toLowerCase().trim();
    if (!seenNames.has(key) && p.imageUrl) {
      seenNames.add(key);
      uniqueProducts.push(p);
    } else if (!p.imageUrl) {
      console.log(`⚠️  Skipping ${p.name} - no image found`);
    }
  });
  
  console.log(`\n✅ Extracted ${uniqueProducts.length} products with images:\n`);
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

