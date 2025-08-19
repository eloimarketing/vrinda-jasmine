import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/prisma'
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build where clause for approved products
    const where: any = { isApproved: true }

    // If category is provided, filter by category
    if (category) {
      // Map category names to enum values
      const categoryMap: { [key: string]: string } = {
        'Refrigeration': 'REFRIGERATION',
        'Cooking Appliances': 'COOKING_APPLIANCES',
        'Appliances': 'APPLIANCES',
        'Kitchenware & Equipment': 'KITCHENWARE_EQUIPMENT',
        'Consumables': 'CONSUMABLES',
        'Kitchen Furniture': 'KITCHEN_FURNITURE',
        'Cleaning': 'CLEANING',
        'Graded Equipment': 'GRADED_EQUIPMENT',
        'Barware': 'BARWARE',
        'Tableware': 'TABLEWARE',
        'Kitchen Accessories': 'KITCHEN_ACCESSORIES',
        'Catering Supplies': 'CATERING_SUPPLIES',
      }
      
      where.category = categoryMap[category]
    }

    // Get all products with the given filters
    const products = await prisma.product.findMany({
      where,
      select: {
        brand: true,
        subcategory: true,
        category: true,
      },
    })

    // Extract unique brands
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort()

    // Get subcategories for the selected category
    let subcategories: Array<{id: string, name: string}> = []
    if (category) {
      const categoryData = PRODUCT_CATEGORIES.find(cat => cat.name === category)
      if (categoryData) {
        subcategories = categoryData.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name
        }))
      }
    }

    return NextResponse.json({
      brands,
      subcategories,
      totalProducts: products.length
    })

  } catch (error) {
    console.error('Error fetching filter data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter data' },
      { status: 500 }
    )
  }
} 