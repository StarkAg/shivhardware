import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { PREFIX } from '@/lib/catalogs'

export const dynamic = 'force-dynamic'

// Writes the catalog's meta.json after the browser has uploaded the two files.
export async function POST(request) {
  try {
    const { slug, name, pdfUrl, imageUrl, width, height, size, device } = await request.json()
    if (!slug || !name || !pdfUrl || !imageUrl) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const meta = {
      slug,
      name,
      pdfUrl,
      imageUrl,
      width: width || null,
      height: height || null,
      size: size || null,
      device: device || null,
      createdAt: Date.now(),
    }
    await put(`${PREFIX}${slug}/meta.json`, JSON.stringify(meta), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    return NextResponse.json({ ok: true, slug, url: `/catalogs/c/${slug}` })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
