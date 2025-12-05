const fs = require('fs');
const path = require('path');
const https = require('https');

// Download images for a single collection
const collectionName = process.argv[2] || 'hinges-channels-handles';

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
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://home-run.co/'
      },
      timeout: 30000 // 30 second timeout
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
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(new Error('Request timeout'));
    });
  });
}

async function processCollection(collectionName) {
  const jsonPath = path.join(__dirname, 'product-data', `${collectionName}.json`);
  const outputDir = path.join(__dirname, '..', 'public', 'scraped-images', collectionName);
  
  if (!fs.existsSync(jsonPath)) {
    console.log(`❌ JSON file not found: ${jsonPath}`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`\n📦 ${collectionName.toUpperCase()}`);
    console.log(`   Found ${products.length} products\n`);
    
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
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.log(`      ❌ Failed: ${err.message}`);
      }
    }
    
    console.log(`\n✅ Completed: ${collectionName}\n`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

processCollection(collectionName).catch(console.error);

