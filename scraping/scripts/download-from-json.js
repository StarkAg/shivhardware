const fs = require('fs');
const path = require('path');
const https = require('https');

const collections = [
  'plywood-mdf-hdhmr',
  'fevicol',
  'kitchen-systems-accessories',
  'hinges-channels-handles',
  'wardrobe-bed-fittings',
  'door-locks-hardware',
  'general-hardware-tools'
];

function cleanFileName(name) {
  return name
    .replace(/[^\w\s-]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .trim()
    .substring(0, 100);
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

async function processCollection(collectionName) {
  const jsonPath = path.join(__dirname, 'product-data', `${collectionName}.json`);
  const outputDir = path.join(__dirname, '..', 'public', 'scraped-images', collectionName);
  
  if (!fs.existsSync(jsonPath)) {
    console.log(`   ⚠️  JSON file not found: ${jsonPath}`);
    console.log(`      Create this file with product data (see SCRAPING_INSTRUCTIONS.md)`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`   Found ${products.length} products in JSON`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const cleanName = cleanFileName(product.name || product.slug);
      const extension = product.imageUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)?.[1] || 'jpg';
      const filename = `${cleanName}.${extension}`;
      const filepath = path.join(outputDir, filename);
      
      if (fs.existsSync(filepath)) {
        console.log(`   [${i + 1}/${products.length}] ⏭️  ${filename} (exists)`);
        continue;
      }
      
      if (!product.imageUrl) {
        console.log(`   [${i + 1}/${products.length}] ⚠️  ${cleanName} (no image URL)`);
        continue;
      }
      
      console.log(`   [${i + 1}/${products.length}] Downloading: ${filename}`);
      
      try {
        await downloadImage(product.imageUrl, filepath);
        console.log(`      ✅ Saved`);
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) {
        console.log(`      ❌ Failed: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting image download from JSON files...\n');
  
  const dataDir = path.join(__dirname, 'product-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✅ Created directory: ${dataDir}`);
    console.log(`   Add JSON files here (see SCRAPING_INSTRUCTIONS.md)\n`);
  }
  
  for (const collection of collections) {
    console.log(`\n📦 ${collection.toUpperCase()}`);
    await processCollection(collection);
  }
  
  console.log('\n✅ All downloads completed!');
}

main().catch(console.error);

