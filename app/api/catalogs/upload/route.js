import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { PREFIX } from '@/lib/catalogs'

export const dynamic = 'force-dynamic'

// Issues short-lived client tokens so the browser can upload the PDF + preview
// image straight to Blob storage (bypasses the 4.5 MB serverless body limit).
export async function POST(request) {
  const body = await request.json()
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(PREFIX)) {
          throw new Error('Invalid upload path')
        }
        return {
          allowedContentTypes: ['application/pdf', 'image/jpeg'],
          addRandomSuffix: false,
          allowOverwrite: true,
          maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB per file
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
