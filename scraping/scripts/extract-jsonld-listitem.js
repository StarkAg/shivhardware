// ============================================
// EXTRACT FROM JSON-LD - ListItem Format
// ============================================
// This script handles the ListItem format used by HomeRun
// Products are ListItem type with image and url, name from URL slug

(function() {
  console.log('🔍 Extracting products from JSON-LD (ListItem format)...\n');
  
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
        console.log(`✓ Found ItemList in script ${scriptIndex + 1} with ${data.itemListElement.length} items\n`);
        
        data.itemListElement.forEach((item, index) => {
          try {
            // Items are ListItem type with image and url directly
            if (item['@type'] !== 'ListItem') {
              return;
            }
            
            const image = item.image;
            const url = item.url || item['@id'];
            
            if (!image || !url) {
              console.log(`⚠️  [${index + 1}] Missing image or URL`);
              return;
            }
            
            // Extract product name from URL slug
            const slug = url.split('/products/')[1]?.split('?')[0]?.split('#')[0] || '';
            if (!slug) {
              console.log(`⚠️  [${index + 1}] Could not extract slug from URL`);
              return;
            }
            
            // Convert slug to readable name
            let productName = slug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Clean up common patterns
            productName = productName
              .replace(/Mr/g, 'MR')
              .replace(/Bwp/g, 'BWP')
              .replace(/Mdf/g, 'MDF')
              .replace(/Hdhmr/g, 'HDHMR')
              .replace(/\bX\b/g, 'X')
              .replace(/\b8x4\b/gi, '8\' X 4\'')
              .replace(/\b8x 4\b/gi, '8\' X 4\'')
              .trim();
            
            // Normalize image URL
            let imageUrl = image;
            if (typeof imageUrl === 'string') {
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              } else if (imageUrl.startsWith('/')) {
                imageUrl = window.location.origin + imageUrl;
              }
              
              // Remove size constraints for better quality
              if (imageUrl.includes('?width=') || imageUrl.includes('&width=')) {
                imageUrl = imageUrl.split('?')[0] + (imageUrl.includes('?v=') ? '?' : '?') + imageUrl.split('?')[1]?.split('&').find(p => p.startsWith('v=')) || 'v=1';
              }
            }
            
            products.push({
              name: productName,
              slug: slug,
              imageUrl: imageUrl
            });
            
            console.log(`✓ [${index + 1}] ${productName}`);
            
          } catch (err) {
            console.error(`❌ Error processing item ${index + 1}:`, err.message);
          }
        });
      }
    } catch (e) {
      // Skip invalid JSON
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

