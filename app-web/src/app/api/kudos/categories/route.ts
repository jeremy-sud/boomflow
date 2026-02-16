import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/kudos/categories - Get kudo categories
export async function GET() {
  try {
    const categories = await prisma.kudoCategory.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching kudo categories:', error)
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    )
  }
}
