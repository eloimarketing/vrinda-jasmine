import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/supplier/edit-product-form'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth()
  if (!session || session.user?.role !== 'SUPPLIER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  const { id } = await params

  // Try to find the product in the unified Product table first
  let product = await prisma.product.findUnique({
    where: { 
      id,
      ownerId: session.user.id // Ensure the product belongs to the current user
    },
    include: {
      attributes: true
    }
  })

  let productType = 'unified'

  // If not found in unified table, search in legacy tables
  if (!product) {
    // Search in all legacy tables
    const legacyTables = [
      'glassDoorRefrigeration',
      'iceCreamFreezers',
      'drinksFridgesBottleCoolers',
      'serveOverCounters',
      'multideckDisplays',
      'uprightUndercounterFridges',
      'freezersChestAndUpright',
      'rangeCookersInductionCookersHobs',
      'ovens',
      'gnPansAccessories',
      'cookware',
      'beverageMachines',
      'blendersMixers',
      'slushMachines',
      'allAppliances',
      'generalEquipment',
      'generalConsumables',
      'allFurniture',
      'dishwashersGlasswashers',
      'hygieneAccessories',
      'laundryMachines',
      'allGradedProducts'
    ]

    for (const tableName of legacyTables) {
      try {
        const legacyProduct = await (prisma as any)[tableName].findUnique({
          where: { 
            id,
            ownerId: session.user.id
          }
        })
        
        if (legacyProduct) {
          product = legacyProduct
          productType = 'legacy'
          break
        }
      } catch (error) {
        // Continue to next table if this one doesn't exist
        continue
      }
    }
  }

  if (!product) {
    notFound()
  }

  return (
    <MaxWidthWrapper className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update your product information</p>
      </div>
      
      <EditProductForm 
        product={product} 
        productType={productType}
        userId={session.user.id}
      />
    </MaxWidthWrapper>
  )
} 