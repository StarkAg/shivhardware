// ============================================
// DEBUG SCRIPT - Check what's on the page
// ============================================
// Run this FIRST to see what the page structure looks like
// Copy and paste into browser console

console.log('🔍 DEBUGGING PAGE STRUCTURE\n');
console.log('=' .repeat(50));

// Check for product links
const productLinks = document.querySelectorAll('a[href*="/products/"]');
console.log(`\n1. Product Links Found: ${productLinks.length}`);

if (productLinks.length > 0) {
  console.log('\nFirst 3 product links:');
  Array.from(productLinks).slice(0, 3).forEach((link, i) => {
    console.log(`   ${i + 1}. ${link.getAttribute('href')}`);
    const img = link.querySelector('img');
    console.log(`      Has image: ${!!img}`);
    if (img) {
      console.log(`      Image src: ${img.src || img.dataset.src || 'none'}`);
    }
  });
} else {
  console.log('   ❌ NO PRODUCT LINKS FOUND!');
  console.log('\n   Trying alternative selectors...');
  
  // Try common Shopify patterns
  const alternatives = [
    'a[href*="product"]',
    '[class*="product"] a',
    '.product-item a',
    '.product-card a',
    'article a'
  ];
  
  alternatives.forEach(selector => {
    const matches = document.querySelectorAll(selector);
    if (matches.length > 0) {
      console.log(`   ✓ Found ${matches.length} with: ${selector}`);
    }
  });
}

// Check for images
const allImages = document.querySelectorAll('img');
console.log(`\n2. Total Images on Page: ${allImages.length}`);

const productImages = Array.from(allImages).filter(img => {
  const src = img.src || img.dataset.src || '';
  return src.includes('cdn') || src.includes('shop') || src.includes('product');
});

console.log(`   Product-related images: ${productImages.length}`);

if (productImages.length > 0) {
  console.log('\nFirst 3 product images:');
  productImages.slice(0, 3).forEach((img, i) => {
    const src = img.src || img.dataset.src || 'no src';
    console.log(`   ${i + 1}. ${src.substring(0, 80)}...`);
  });
}

// Check for JSON-LD data
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
console.log(`\n3. JSON-LD Scripts: ${jsonLdScripts.length}`);

if (jsonLdScripts.length > 0) {
  jsonLdScripts.forEach((script, i) => {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'ItemList' || data['@type'] === 'Product') {
        console.log(`   ✓ Script ${i + 1}: ${data['@type']}`);
        if (data.itemListElement) {
          console.log(`      Products in list: ${data.itemListElement.length}`);
        }
      }
    } catch (e) {
      // Not valid JSON
    }
  });
}

// Check page structure
console.log('\n4. Page Structure:');
console.log(`   Title: ${document.title}`);
console.log(`   URL: ${window.location.href}`);

// Look for common product containers
const containers = [
  '.product-grid',
  '.collection-products',
  '[class*="product-grid"]',
  '[class*="collection"]',
  '.grid'
];

console.log('\n5. Looking for product containers:');
containers.forEach(selector => {
  const matches = document.querySelectorAll(selector);
  if (matches.length > 0) {
    console.log(`   ✓ Found: ${selector} (${matches.length} matches)`);
    const first = matches[0];
    const links = first.querySelectorAll('a[href*="/products/"]');
    if (links.length > 0) {
      console.log(`      Contains ${links.length} product links`);
    }
  }
});

console.log('\n' + '='.repeat(50));
console.log('\n💡 NEXT STEPS:');
if (productLinks.length === 0) {
  console.log('   1. Scroll to bottom of page to load all products');
  console.log('   2. Wait 3-5 seconds');
  console.log('   3. Run this script again');
  console.log('   4. If still 0, try: extract-products-simple.js');
} else {
  console.log('   ✓ Products found! Now run: extract-products-simple.js');
}

