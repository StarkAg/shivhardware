import { list } from '@vercel/blob'

// All catalog blobs live under this prefix:
//   catalogs/<slug>/file.pdf
//   catalogs/<slug>/preview.jpg
//   catalogs/<slug>/meta.json   { slug, name, pdfUrl, imageUrl, width, height, createdAt }
export const PREFIX = 'catalogs/'

export function slugify(str) {
  return (
    String(str || '')
      .toLowerCase()
      .replace(/\.pdf$/i, '')
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'catalog'
  )
}

export function nameFromFilename(filename) {
  return (
    String(filename || '')
      .replace(/\.pdf$/i, '')
      .replace(/[_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Catalogue'
  )
}

// Guarantee the slug isn't already taken (so uploads never clobber an existing catalog).
export async function uniqueSlug(base) {
  const { blobs } = await list({ prefix: PREFIX })
  const taken = new Set(blobs.map((b) => b.pathname))
  let slug = base
  let n = 2
  while (taken.has(`${PREFIX}${slug}/meta.json`)) slug = `${base}-${n++}`
  return slug
}

async function readMeta(url) {
  try {
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

export async function listCatalogs() {
  const { blobs } = await list({ prefix: PREFIX })
  const metas = blobs.filter((b) => b.pathname.endsWith('/meta.json'))
  const items = await Promise.all(metas.map((b) => readMeta(b.url)))
  return items
    .filter(Boolean)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

export async function getCatalog(slug) {
  const { blobs } = await list({ prefix: `${PREFIX}${slug}/` })
  const meta = blobs.find((b) => b.pathname === `${PREFIX}${slug}/meta.json`)
  if (!meta) return null
  return readMeta(meta.url)
}
