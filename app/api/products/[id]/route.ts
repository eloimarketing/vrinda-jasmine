import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('API: Looking for product with ID:', id)
    
    // Find the product using the unified Product model
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true
          }
        },
        attributes: true
      }
    })

    console.log('API: Product found:', product ? 'Yes' : 'No')
    if (product) {
      console.log('API: Product category:', product.category)
      console.log('API: Product approved:', product.isApproved)
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // For now, allow viewing even if not approved (for supplier testing)
    // if (!product.isApproved) {
    //   return NextResponse.json(
    //     { error: 'Product not approved' },
    //     { status: 404 }
    //   )
    // }

    return NextResponse.json(product)
  } catch (error) {
    console.error('API: Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 