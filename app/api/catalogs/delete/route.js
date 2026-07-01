import { del, list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { PREFIX } from '@/lib/catalogs'

export const dynamic = 'force-dynamic'

// Deletes every blob belonging to a catalogue (file.pdf, preview.jpg, meta.json).
export async function POST(request) {
  try {
    const { slug } = await request.json()
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    const { blobs } = await list({ prefix: `${PREFIX}${slug}/` })
    if (blobs.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await Promise.all(blobs.map((b) => del(b.url)))
    return NextResponse.json({ ok: true, deleted: blobs.length })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
