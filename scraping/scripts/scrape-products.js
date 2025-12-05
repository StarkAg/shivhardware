const fs = require('fs');
const path = require('path');
const https = require('https');

const collections = [
  { name: 'plywood-mdf-hdhmr', url: 'https://home-run.co/collections/plywood-mdf-hdhmr' },
  { name: 'fevicol', url: 'https://home-run.co/collections/fevicol' },
  { name: 'kitchen-systems-accessories', url: 'https://home-run.co/collections/kitchen-systems-accessories' },
  { name: 'hinges-channels-handles', url: 'https://home-run.co/collections/hinges-channels-handles' },
  { name: 'wardrobe-bed-fittings', url: 'https://home-run.co/collections/wardrobe-bed-fittings' },
  { name: 'door-locks-hardware', url: 'https://home-run.co/collections/door-locks-hardware' },
  { name: 'general-hardware-tools', url: 'https://home-run.co/collections/general-hardware-tools' }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanFileName(name) {
  return name
    .replace(/[^\w\s-]/g, '')
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .trim()
    .substring(0, 100);
}

function extractProducts(html) {
  const products = [];
  
  // Extract from JSON-LD structured data (Shopify uses this)
  const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  
  for (const jsonLd of jsonLdMatches) {
    try {
      const jsonContent = jsonLd.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
      const data = JSON.parse(jsonContent);
      
      if (data['@type'] === 'ItemList' && data.itemListElement) {
        data.itemListElement.forEach(item => {
          if (item.item && item.item['@type'] === 'Product') {
            const product = item.item;
            const name = product.name || '';
            const image = product.image || (Array.isArray(product.image) ? product.image[0] : '');
            
            if (name && image) {
              products.push({ name, imageUrl: image });
            }
          }
        });
      }
    } catch (e) {
      // Try parsing as array
      try {
        const data = JSON.parse(jsonContent);
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item['@type'] === 'Product' || item.type === 'Product') {
              const name = item.name || '';
              const image = item.image || (Array.isArray(item.image) ? item.image[0] : '');
              if (name && image) {
                products.push({ name, imageUrl: image });
              }
            }
          });
        }
      } catch (e2) {
        // Skip invalid JSON
      }
    }
  }
  
  // Fallback: Extract from product links
  if (products.length === 0) {
    const productLinks = html.match(/<a[^>]*href="\/products\/([^"]+)"[^>]*>[\s\S]*?<\/a>/gi) || [];
    
    productLinks.forEach(link => {
      try {
        const slugMatch = link.match(/href="\/products\/([^"]+)"/);
        if (!slugMatch) return;
        
        const slug = slugMatch[1].split('?')[0];
        
        // Find image in the link
        const imgMatch = link.match(/<img[^>]*src="([^"]+)"/i) || 
                         link.match(/data-src="([^"]+)"/i);
        if (!imgMatch) return;
        
        let imageUrl = imgMatch[1];
        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
        if (imageUrl.startsWith('/')) imageUrl = 'https://home-run.co' + imageUrl;
        
        // Find title
        const titleMatch = link.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i) ||
                          link.match(/alt="([^"]+)"/i);
        
        const name = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
        
        // Skip duplicates
        if (!products.find(p => p.imageUrl === imageUrl)) {
          products.push({ name, imageUrl });
        }
      } catch (e) {
        // Skip errors
      }
    });
  }
  
  return products;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://home-run.co/'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function scrapeCollection(collection) {
  console.log(`\n📦 ${collection.name.toUpperCase()}`);
  console.log(`   URL: ${collection.url}`);
  
  const outputDir = path.join(__dirname, '..', 'public', 'scraped-images', collection.name);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    console.log(`   Fetching page...`);
    const html = await fetchHTML(collection.url);
    
    console.log(`   Extracting products...`);
    const products = extractProducts(html);
    
    if (products.length === 0) {
      console.log(`   ⚠️  No products found. Saving HTML for manual inspection...`);
      fs.writeFileSync(path.join(outputDir, 'page.html'), html);
      return;
    }
    
    console.log(`   Found ${products.length} products`);
    
    // Download each product image
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const cleanName = cleanFileName(product.name);
      const extension = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)?.[1] || 'jpg';
      const filename = `${cleanName}.${extension}`;
      const filepath = path.join(outputDir, filename);
      
      if (fs.existsSync(filepath)) {
        console.log(`   [${i + 1}/${products.length}] ⏭️  ${filename} (exists)`);
        continue;
      }
      
      console.log(`   [${i + 1}/${products.length}] Downloading: ${filename}`);
      
      try {
        await downloadImage(product.imageUrl, filepath);
        console.log(`      ✅ Saved`);
        
        // Delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log(`      ❌ Failed: ${err.message}`);
      }
    }
    
    console.log(`   ✅ Completed`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting HomeRun Product Image Scraper\n');
  console.log(`Collections to scrape: ${collections.length}\n`);
  
  for (const collection of collections) {
    await scrapeCollection(collection);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ All scraping completed!');
}

main().catch(console.error);

