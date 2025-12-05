const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Collection URLs
const collections = [
  {
    name: 'plywood-mdf-hdhmr',
    url: 'https://home-run.co/collections/plywood-mdf-hdhmr'
  },
  {
    name: 'fevicol',
    url: 'https://home-run.co/collections/fevicol'
  },
  {
    name: 'kitchen-systems-accessories',
    url: 'https://home-run.co/collections/kitchen-systems-accessories'
  },
  {
    name: 'hinges-channels-handles',
    url: 'https://home-run.co/collections/hinges-channels-handles'
  },
  {
    name: 'wardrobe-bed-fittings',
    url: 'https://home-run.co/collections/wardrobe-bed-fittings'
  },
  {
    name: 'door-locks-hardware',
    url: 'https://home-run.co/collections/door-locks-hardware'
  },
  {
    name: 'general-hardware-tools',
    url: 'https://home-run.co/collections/general-hardware-tools'
  }
];

// Helper function to download HTML
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Helper function to extract products from HTML
function extractProducts(html, collectionName) {
  const products = [];
  
  // Extract product cards - looking for Shopify product structure
  // Pattern: Product cards with images and titles
  const productCardRegex = /<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  const matches = html.match(/<div[^>]*class="[^"]*product-card[^"]*"[^>]*>[\s\S]*?<\/div>/gi) || 
                  html.match(/<article[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/article>/gi) ||
                  [];
  
  // Alternative: Look for product links and images
  const productLinkRegex = /<a[^>]*href="\/products\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi;
  const linkMatches = html.match(productLinkRegex) || [];
  
  for (const match of linkMatches) {
    try {
      // Extract product URL
      const urlMatch = match.match(/href="(\/products\/[^"]+)"/);
      if (!urlMatch) continue;
      
      const productPath = urlMatch[1];
      const productSlug = productPath.split('/').pop();
      
      // Extract product title
      const titleMatch = match.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i) || 
                        match.match(/title="([^"]+)"/i) ||
                        match.match(/alt="([^"]+)"/i);
      
      if (!titleMatch) continue;
      
      let productName = titleMatch[1]
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      
      // Extract image URL
      const imgMatch = match.match(/<img[^>]*src="([^"]+)"/i) || 
                      match.match(/srcset="([^"]+)"/i) ||
                      match.match(/data-src="([^"]+)"/i);
      
      if (!imgMatch) continue;
      
      let imageUrl = imgMatch[1];
      
      // Handle relative URLs and Shopify CDN URLs
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = 'https://home-run.co' + imageUrl;
      } else if (!imageUrl.startsWith('http')) {
        continue;
      }
      
      // Skip placeholder images
      if (imageUrl.includes('placeholder') || imageUrl.includes('no-image')) {
        continue;
      }
      
      products.push({
        name: productName || productSlug,
        imageUrl: imageUrl,
        slug: productSlug
      });
    } catch (err) {
      console.error('Error parsing product:', err.message);
    }
  }
  
  return products;
}

// Helper function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Main scraping function
async function scrapeCollection(collection) {
  console.log(`\n📦 Starting: ${collection.name}`);
  console.log(`   URL: ${collection.url}`);
  
  const outputDir = path.join(__dirname, '..', 'public', 'scraped-images', collection.name);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Fetch HTML
    console.log(`   Fetching HTML...`);
    const html = await fetchHTML(collection.url);
    
    // Extract products
    console.log(`   Extracting products...`);
    const products = extractProducts(html, collection.name);
    
    if (products.length === 0) {
      console.log(`   ⚠️  No products found. Trying alternative extraction...`);
      // Try to find products using JSON-LD structured data
      const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatch) {
        console.log(`   Found JSON-LD data, parsing...`);
        // Add JSON-LD parsing logic here if needed
      }
      return;
    }
    
    console.log(`   Found ${products.length} products`);
    
    // Download images
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const extension = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)?.[1] || 'jpg';
      const filename = `${product.name}.${extension}`;
      const filepath = path.join(outputDir, filename);
      
      console.log(`   [${i + 1}/${products.length}] Downloading: ${filename}`);
      
      try {
        await downloadImage(product.imageUrl, filepath);
        console.log(`      ✅ Saved: ${filename}`);
        
        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.log(`      ❌ Failed: ${err.message}`);
      }
    }
    
    console.log(`   ✅ Completed: ${collection.name}`);
    
  } catch (error) {
    console.error(`   ❌ Error scraping ${collection.name}:`, error.message);
  }
}

// Run scraper for all collections
async function main() {
  console.log('🚀 Starting image scraping...');
  console.log(`   Collections: ${collections.length}`);
  
  for (const collection of collections) {
    await scrapeCollection(collection);
    // Delay between collections
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ All scraping completed!');
}

main().catch(console.error);

