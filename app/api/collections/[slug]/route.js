import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
  try {
    // Unwrap params Promise for Next.js 15
    const { slug } = await params
    const filePath = path.join(process.cwd(), 'data', 'collections', `${slug}.json`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const products = JSON.parse(fileContents)

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading collection:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

