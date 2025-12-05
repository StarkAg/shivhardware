// ============================================
// FINAL EXTRACTION - ListItem Format with Better Names
// ============================================
// Handles ListItem format and extracts names from page text

(function() {
  console.log('🔍 Extracting products from JSON-LD...\n');
  
  const products = [];
  
  // Find JSON-LD script with ItemList
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  jsonLdScripts.forEach((script) => {
    try {
      const jsonText = script.textContent;
      let data = JSON.parse(jsonText);
      
      if (Array.isArray(data)) {
        data = data.find(item => item['@type'] === 'ItemList') || data[0];
      }
      
      if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
        console.log(`✓ Found ItemList with ${data.itemListElement.length} products\n`);
        
        data.itemListElement.forEach((item, index) => {
          try {
            if (item['@type'] !== 'ListItem') return;
            
            const image = item.image;
            const url = item.url || item['@id'];
            
            if (!image || !url) return;
            
            // Get slug from URL
            const slug = url.split('/products/')[1]?.split('?')[0]?.split('#')[0] || '';
            if (!slug) return;
            
            // Try to find product name from page text (better than slug)
            let productName = null;
            const productLinks = Array.from(document.querySelectorAll(`a[href*="${slug}"]`));
            
            productLinks.forEach(link => {
              // Look for heading/text in link or container
              const container = link.closest('[class*="product"], article, li, .card, .grid__item');
              if (container) {
                // Try to find product title
                const titleEl = container.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"], .card__heading');
                if (titleEl) {
                  const text = titleEl.textContent?.trim();
                  if (text && text.length > 0 && text.length < 200) {
                    productName = text;
                  }
                }
              }
            });
            
            // Fallback: Convert slug to readable name
            if (!productName) {
              productName = slug
                .split('-')
                .map(word => {
                  // Capitalize properly
                  if (word === 'mr') return 'MR';
                  if (word === 'bwp') return 'BWP';
                  if (word === 'mdf') return 'MDF';
                  if (word === 'hdhmr') return 'HDHMR';
                  if (word === 'x') return 'X';
                  return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(' ')
                .replace(/\b8x4\b/gi, '8\' X 4\'')
                .replace(/\b8x 4\b/gi, '8\' X 4\'')
                .trim();
            }
            
            // Normalize image URL
            let imageUrl = image;
            if (typeof imageUrl === 'string') {
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              } else if (imageUrl.startsWith('/')) {
                imageUrl = window.location.origin + imageUrl;
              }
            }
            
            products.push({
              name: productName,
              slug: slug,
              imageUrl: imageUrl
            });
            
            console.log(`✓ [${index + 1}] ${productName}`);
            
          } catch (err) {
            console.error(`❌ Error on item ${index + 1}:`, err.message);
          }
        });
      }
    } catch (e) {
      // Skip
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
  
  console.log(`\n✅ Extracted ${uniqueProducts.length} products:\n`);
  uniqueProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   ${p.imageUrl}\n`);
  });
  
  // JSON output
  const jsonOutput = JSON.stringify(uniqueProducts, null, 2);
  console.log('📋 JSON:\n');
  console.log(jsonOutput);
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('\n✅ ✅ ✅ COPIED TO CLIPBOARD! ✅ ✅ ✅');
      console.log('\n💾 Save to: scripts/product-data/plywood-mdf-hdhmr.json');
      console.log('   Then run: node scripts/download-from-json.js');
    }).catch(() => {
      console.log('\n⚠️  Copy failed. Please copy JSON manually.');
    });
  }
  
  window.extractedProducts = uniqueProducts;
  window.extractedProductsJSON = jsonOutput;
  
  return uniqueProducts;
})();

