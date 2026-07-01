import { NextResponse } from 'next/server'
import { slugify, uniqueSlug } from '@/lib/catalogs'

export const dynamic = 'force-dynamic'

// GET /api/catalogs/slug?name=Some%20Catalogue  ->  { slug }
export async function GET(request) {
  const name = new URL(request.url).searchParams.get('name') || 'catalog'
  try {
    const slug = await uniqueSlug(slugify(name))
    return NextResponse.json({ slug })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
