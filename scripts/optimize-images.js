#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Optimizes all images in public/scraped-images by:
 * - Converting to WebP format (smaller file size)
 * - Resizing large images to max 1200px width/height
 * - Compressing with quality 85
 * - Preserving original files in _originals folder
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const SCRAPED_IMAGES_DIR = path.join(process.cwd(), 'public', 'scraped-images')
const ORIGINALS_DIR = path.join(SCRAPED_IMAGES_DIR, '_originals')
const MAX_DIMENSION = 1200
const QUALITY = 85

// Supported image formats
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function getImageFiles(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory() && entry.name !== '_originals') {
      files.push(...getImageFiles(fullPath))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function optimizeImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase()
  const dir = path.dirname(inputPath)
  const basename = path.basename(inputPath, ext)
  
  // Skip if already WebP and small
  if (ext === '.webp') {
    const stats = fs.statSync(inputPath)
    if (stats.size < 200 * 1024) { // Less than 200KB
      console.log(`⏭️  Skipping ${path.relative(SCRAPED_IMAGES_DIR, inputPath)} (already optimized)`)
      return
    }
  }

  // Create originals backup
  const relativePath = path.relative(SCRAPED_IMAGES_DIR, inputPath)
  const originalPath = path.join(ORIGINALS_DIR, relativePath)
  ensureDir(path.dirname(originalPath))
  
  if (!fs.existsSync(originalPath)) {
    fs.copyFileSync(inputPath, originalPath)
  }

  // Output as WebP
  const outputPath = path.join(dir, `${basename}.webp`)

  try {
    // Use ImageMagick to resize and convert
    // -resize: maintain aspect ratio, max dimension
    // -quality: WebP quality (1-100)
    // -strip: remove metadata
    // -define webp:lossless=false: use lossy compression
    const command = `convert "${inputPath}" -resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" -quality ${QUALITY} -strip -define webp:lossless=false "${outputPath}"`
    
    execSync(command, { stdio: 'pipe' })
    
    const originalSize = fs.statSync(inputPath).size
    const newSize = fs.statSync(outputPath).size
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1)
    
    console.log(`✅ ${path.relative(SCRAPED_IMAGES_DIR, inputPath)} → ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`)
    
    // Remove original if conversion successful and different file
    if (outputPath !== inputPath && ext !== '.webp') {
      fs.unlinkSync(inputPath)
    }
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message)
  }
}

function main() {
  console.log('🖼️  Starting image optimization...\n')
  console.log(`📁 Source: ${SCRAPED_IMAGES_DIR}`)
  console.log(`📏 Max dimension: ${MAX_DIMENSION}px`)
  console.log(`🎨 Quality: ${QUALITY}%\n`)

  ensureDir(ORIGINALS_DIR)

  const imageFiles = getImageFiles(SCRAPED_IMAGES_DIR)
  
  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to optimize')
    return
  }

  console.log(`Found ${imageFiles.length} images to optimize\n`)

  let processed = 0
  let skipped = 0

  for (const file of imageFiles) {
    try {
      optimizeImage(file)
      processed++
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message)
      skipped++
    }
  }

  console.log(`\n✨ Optimization complete!`)
  console.log(`   Processed: ${processed}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`\n💾 Originals backed up to: ${path.relative(process.cwd(), ORIGINALS_DIR)}`)
}

main()

