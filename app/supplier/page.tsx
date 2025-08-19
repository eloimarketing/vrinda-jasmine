import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Package, TrendingUp, Users } from 'lucide-react'

export default async function SupplierDashboard() {
  const session = await auth()
  if (!session || session.user?.role !== 'SUPPLIER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  // Get products from all subcategory tables (existing)
  const [
    glassDoorRefrigerations,
    iceCreamFreezers,
    drinksFridgesBottleCoolers,
    serveOverCounters,
    multideckDisplays,
    uprightUndercounterFridges,
    freezersChestAndUpright,
    rangeCookersInductionCookersHobs,
    ovens,
    gnPansAccessories,
    cookware,
    beverageMachines,
    blendersMixers,
    slushMachines,
    allAppliances,
    generalEquipment,
    generalConsumables,
    allFurniture,
    dishwashersGlasswashers,
    hygieneAccessories,
    laundryMachines,
    allGradedProducts
  ] = await Promise.all([
    prisma.glassDoorRefrigeration.findMany({ where: { ownerId: session.user.id } }),
    prisma.iceCreamFreezers.findMany({ where: { ownerId: session.user.id } }),
    prisma.drinksFridgesBottleCoolers.findMany({ where: { ownerId: session.user.id } }),
    prisma.serveOverCounters.findMany({ where: { ownerId: session.user.id } }),
    prisma.multideckDisplays.findMany({ where: { ownerId: session.user.id } }),
    prisma.uprightUndercounterFridges.findMany({ where: { ownerId: session.user.id } }),
    prisma.freezersChestAndUpright.findMany({ where: { ownerId: session.user.id } }),
    prisma.rangeCookersInductionCookersHobs.findMany({ where: { ownerId: session.user.id } }),
    prisma.ovens.findMany({ where: { ownerId: session.user.id } }),
    prisma.gnPansAccessories.findMany({ where: { ownerId: session.user.id } }),
    prisma.cookware.findMany({ where: { ownerId: session.user.id } }),
    prisma.beverageMachines.findMany({ where: { ownerId: session.user.id } }),
    prisma.blendersMixers.findMany({ where: { ownerId: session.user.id } }),
    prisma.slushMachines.findMany({ where: { ownerId: session.user.id } }),
    prisma.allAppliances.findMany({ where: { ownerId: session.user.id } }),
    prisma.generalEquipment.findMany({ where: { ownerId: session.user.id } }),
    prisma.generalConsumables.findMany({ where: { ownerId: session.user.id } }),
    prisma.allFurniture.findMany({ where: { ownerId: session.user.id } }),
    prisma.dishwashersGlasswashers.findMany({ where: { ownerId: session.user.id } }),
    prisma.hygieneAccessories.findMany({ where: { ownerId: session.user.id } }),
    prisma.laundryMachines.findMany({ where: { ownerId: session.user.id } }),
    prisma.allGradedProducts.findMany({ where: { ownerId: session.user.id } })
  ])

  // Get new unified products
  const unifiedProducts = await prisma.product.findMany({
    where: { ownerId: session.user.id },
    include: { attributes: true }
  })

  // Combine all products
  const allProducts = [
    ...glassDoorRefrigerations.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Glass Door Refrigeration', type: 'existing' })),
    ...iceCreamFreezers.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Ice Cream Freezers', type: 'existing' })),
    ...drinksFridgesBottleCoolers.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Drinks Fridges & Bottle Coolers', type: 'existing' })),
    ...serveOverCounters.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Serve Over Counters', type: 'existing' })),
    ...multideckDisplays.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Multideck Displays', type: 'existing' })),
    ...uprightUndercounterFridges.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Upright & Undercounter Fridges', type: 'existing' })),
    ...freezersChestAndUpright.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Freezers (Chest & Upright)', type: 'existing' })),
    ...rangeCookersInductionCookersHobs.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Range Cookers, Induction Cookers & Hobs', type: 'existing' })),
    ...ovens.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Ovens', type: 'existing' })),
    ...gnPansAccessories.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'GN Pans & Accessories', type: 'existing' })),
    ...cookware.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Cookware', type: 'existing' })),
    ...beverageMachines.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Beverage Machines', type: 'existing' })),
    ...blendersMixers.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Blenders & Mixers', type: 'existing' })),
    ...slushMachines.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Slush Machines', type: 'existing' })),
    ...allAppliances.map(p => ({ ...p, category: 'Appliances', subcategory: 'All Appliances', type: 'existing' })),
    ...generalEquipment.map(p => ({ ...p, category: 'Kitchenware & Equipment', subcategory: 'General Equipment', type: 'existing' })),
    ...generalConsumables.map(p => ({ ...p, category: 'Consumables', subcategory: 'General Consumables', type: 'existing' })),
    ...allFurniture.map(p => ({ ...p, category: 'Kitchen Furniture', subcategory: 'All Furniture', type: 'existing' })),
    ...dishwashersGlasswashers.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Dishwashers & Glasswashers', type: 'existing' })),
    ...hygieneAccessories.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Hygiene Accessories', type: 'existing' })),
    ...laundryMachines.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Laundry Machines', type: 'existing' })),
    ...allGradedProducts.map(p => ({ ...p, category: 'Graded Equipment', subcategory: 'All Graded Products', type: 'existing' })),
    // Add unified products
    ...unifiedProducts.map(p => ({ 
      ...p, 
      productName: p.name,
      category: p.category,
      subcategory: p.subcategory || 'N/A',
      type: 'unified',
      isApproved: p.isApproved
    }))
  ]

  const totalProducts = allProducts.length
  const totalValue = allProducts.reduce((sum, product) => sum + (product.price || 0), 0)
  const approvedProducts = allProducts.filter(p => p.isApproved !== false).length
  const pendingProducts = allProducts.filter(p => p.isApproved === false).length

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your hospitality equipment listings</p>
        </div>
        <Link href="/supplier/create-product">
          <Button className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined product value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedProducts}</div>
            <p className="text-xs text-muted-foreground">
              Live products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingProducts}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <Badge variant="secondary">{totalProducts} products</Badge>
        </div>

        {allProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first hospitality equipment product</p>
              <Link href="/supplier/create-product">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.slice(0, 6).map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {product.productImage ? (
                      <img 
                        src={product.productImage} 
                        alt={product.productName || product.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-500">Product Image</span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{product.productName || product.name}</CardTitle>
                  <CardDescription>{product.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
                    <div className="flex gap-1">
                      <Badge variant="secondary">{product.category}</Badge>
                      {product.type === 'unified' && (
                        <Badge variant="outline" className="text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {product.subcategory}
                  </div>
                  {product.type === 'unified' && (
                    <div className="mb-4">
                      {product.isApproved ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">Pending Approval</Badge>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {allProducts.length > 6 && (
          <div className="text-center">
            <Link href="/supplier/products">
              <Button variant="outline">
                View All Products ({allProducts.length})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  )
} 