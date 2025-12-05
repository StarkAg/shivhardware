const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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

// Download image helper
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
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

// Clean filename
function cleanFileName(name) {
  return name
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100);
}

async function scrapeCollection(browser, collection) {
  console.log(`\n📦 Scraping: ${collection.name}`);
  
  const page = await browser.newPage();
  const outputDir = path.join(__dirname, '..', 'public', 'scraped-images', collection.name);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    console.log(`   Navigating to: ${collection.url}`);
    await page.goto(collection.url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for products to load
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 }).catch(() => {
      console.log('   ⚠️  Products may be loading...');
    });
    
    // Extract product data
    const products = await page.evaluate(() => {
      const items = [];
      const productLinks = document.querySelectorAll('a[href*="/products/"]');
      
      productLinks.forEach(link => {
        try {
          const href = link.getAttribute('href');
          const productSlug = href.split('/products/')[1]?.split('?')[0];
          
          if (!productSlug) return;
          
          // Find product image
          const img = link.querySelector('img') || 
                     link.closest('.product-card')?.querySelector('img') ||
                     link.parentElement?.querySelector('img');
          
          if (!img) return;
          
          let imageUrl = img.src || img.dataset.src || img.getAttribute('srcset')?.split(' ')[0];
          
          if (!imageUrl) return;
          
          // Handle relative URLs
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            imageUrl = window.location.origin + imageUrl;
          }
          
          // Get product name
          const title = link.querySelector('h2, h3, .product-title') ||
                       link.closest('.product-card')?.querySelector('h2, h3, .product-title') ||
                       img.alt;
          
          const productName = title?.textContent?.trim() || title?.trim() || img.alt || productSlug;
          
          // Skip duplicates
          if (items.find(p => p.slug === productSlug)) return;
          
          items.push({
            name: productName,
            imageUrl: imageUrl,
            slug: productSlug
          });
        } catch (err) {
          console.error('Error extracting product:', err);
        }
      });
      
      return items;
    });
    
    console.log(`   Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log(`   ⚠️  No products found. Saving page HTML for debugging...`);
      const html = await page.content();
      fs.writeFileSync(path.join(outputDir, 'debug.html'), html);
    }
    
    // Download images
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const cleanName = cleanFileName(product.name || product.slug);
      const extension = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)?.[1] || 'jpg';
      const filename = `${cleanName}.${extension}`;
      const filepath = path.join(outputDir, filename);
      
      // Skip if already exists
      if (fs.existsSync(filepath)) {
        console.log(`   [${i + 1}/${products.length}] ⏭️  Skipped (exists): ${filename}`);
        continue;
      }
      
      console.log(`   [${i + 1}/${products.length}] Downloading: ${filename}`);
      
      try {
        await downloadImage(product.imageUrl, filepath);
        console.log(`      ✅ Saved`);
        
        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) {
        console.log(`      ❌ Failed: ${err.message}`);
      }
    }
    
    await page.close();
    console.log(`   ✅ Completed: ${collection.name}`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    await page.close();
  }
}

async function main() {
  console.log('🚀 Starting HomeRun image scraper...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    for (const collection of collections) {
      await scrapeCollection(browser, collection);
      // Delay between collections
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ All scraping completed!');
}

main().catch(console.error);

