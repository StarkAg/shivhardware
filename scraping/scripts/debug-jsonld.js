// ============================================
// DEBUG JSON-LD Structure
// ============================================
// Run this to see the actual structure of JSON-LD data

(function() {
  console.log('🔍 Inspecting JSON-LD structure...\n');
  
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`Found ${jsonLdScripts.length} JSON-LD scripts\n`);
  
  jsonLdScripts.forEach((script, scriptIndex) => {
    try {
      const jsonText = script.textContent;
      let data = JSON.parse(jsonText);
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`SCRIPT ${scriptIndex + 1}:`);
      console.log('='.repeat(60));
      
      // Handle arrays
      if (Array.isArray(data)) {
        console.log('Data is an array with', data.length, 'items');
        data = data.find(item => item['@type'] === 'ItemList') || data[0];
      }
      
      console.log('@type:', data['@type']);
      
      // Look for ItemList
      if (data['@type'] === 'ItemList') {
        console.log('✓ Found ItemList!');
        console.log('itemListElement length:', data.itemListElement?.length || 0);
        
        if (data.itemListElement && data.itemListElement.length > 0) {
          console.log('\nFirst product structure:');
          const firstItem = data.itemListElement[0];
          console.log(JSON.stringify(firstItem, null, 2).substring(0, 1000));
          
          console.log('\nAll products:');
          data.itemListElement.forEach((item, index) => {
            const product = item.item || item;
            console.log(`\n[${index + 1}] Product structure:`);
            console.log('  @type:', product['@type']);
            console.log('  name:', product.name);
            console.log('  image type:', typeof product.image);
            
            if (Array.isArray(product.image)) {
              console.log('  image (array):', product.image[0]);
            } else if (typeof product.image === 'object') {
              console.log('  image (object):', JSON.stringify(product.image).substring(0, 200));
            } else {
              console.log('  image:', product.image);
            }
            
            console.log('  url:', product.url || item.url);
          });
        }
      } else {
        console.log('Not an ItemList, showing first level keys:');
        console.log(Object.keys(data).slice(0, 10));
      }
      
    } catch (e) {
      console.error(`Error parsing script ${scriptIndex + 1}:`, e.message);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 Copy the structure above to help fix the extraction script');
  
})();

