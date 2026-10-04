#!/usr/bin/env node

// One-off: the site's public/ images were shipped at full AI-generation /
// camera resolution (some 3000-4000px wide, several MB each), which is why
// pages felt slow to load. Resize to sane web dimensions and recompress,
// keeping the original extension/format so Content-Type headers stay correct.
// Originals are preserved under public/_originals_backup for safety.

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BACKUP_DIR = path.join(PUBLIC_DIR, '_originals_backup')
const SKIP_DIRS = new Set(['_originals_backup', 'scraped-images', 'catalogs'])
const MIN_SIZE = 300 * 1024 // only touch files bigger than 300KB
const MAX_DIMENSION = 2200
const JPEG_QUALITY = 78
const PNG_COMPRESSION = 9

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(path.join(dir, entry.name), out)
    } else {
      out.push(path.join(dir, entry.name))
    }
  }
  return out
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return

  const stat = fs.statSync(file)
  if (stat.size < MIN_SIZE) return

  const relative = path.relative(PUBLIC_DIR, file)
  const backupPath = path.join(BACKUP_DIR, relative)
  fs.mkdirSync(path.dirname(backupPath), { recursive: true })
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(file, backupPath)
  }

  const img = sharp(backupPath)
  const meta = await img.metadata()

  let pipeline = img.rotate() // auto-orient
  if ((meta.width || 0) > MAX_DIMENSION || (meta.height || 0) > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION, adaptiveFiltering: true })
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  }

  const buffer = await pipeline.toBuffer()
  fs.writeFileSync(file, buffer)

  const before = stat.size
  const after = buffer.length
  const savings = ((1 - after / before) * 100).toFixed(1)
  console.log(
    `${relative}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`
  )
}

async function main() {
  const files = walk(PUBLIC_DIR)
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue
    const before = fs.statSync(file).size
    if (before < MIN_SIZE) continue
    try {
      await processFile(file)
      totalBefore += before
      totalAfter += fs.statSync(file).size
    } catch (e) {
      console.error(`FAILED ${file}: ${e.message}`)
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
  )
}

main()
