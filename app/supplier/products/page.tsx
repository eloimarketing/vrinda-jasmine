import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Search, Filter, Edit, Trash2, Package, Eye } from 'lucide-react'

export default async function SupplierProductsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'SUPPLIER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  // Helper function to map category to URL-friendly format
  const getCategoryUrl = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Refrigeration': 'refrigeration',
      'Cooking Appliances': 'cooking-appliances',
      'Appliances': 'appliances',
      'Kitchenware & Equipment': 'kitchenware-equipment',
      'Consumables': 'consumables',
      'Kitchen Furniture': 'kitchen-furniture',
      'Cleaning': 'cleaning',
      'Graded Equipment': 'graded-equipment',
      'Barware': 'barware',
      'Tableware': 'tableware',
      'Kitchen Accessories': 'kitchen-accessories',
      'Catering Supplies': 'catering-supplies',
    }
    return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-')
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

  // Combine all products with category and subcategory info
  const allProducts = [
    ...glassDoorRefrigerations.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Glass Door Refrigeration', tableName: 'glassDoorRefrigeration', type: 'existing' })),
    ...iceCreamFreezers.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Ice Cream Freezers', tableName: 'iceCreamFreezers', type: 'existing' })),
    ...drinksFridgesBottleCoolers.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Drinks Fridges & Bottle Coolers', tableName: 'drinksFridgesBottleCoolers', type: 'existing' })),
    ...serveOverCounters.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Serve Over Counters', tableName: 'serveOverCounters', type: 'existing' })),
    ...multideckDisplays.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Multideck Displays', tableName: 'multideckDisplays', type: 'existing' })),
    ...uprightUndercounterFridges.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Upright & Undercounter Fridges', tableName: 'uprightUndercounterFridges', type: 'existing' })),
    ...freezersChestAndUpright.map(p => ({ ...p, category: 'Refrigeration', subcategory: 'Freezers (Chest & Upright)', tableName: 'freezersChestAndUpright', type: 'existing' })),
    ...rangeCookersInductionCookersHobs.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Range Cookers, Induction Cookers & Hobs', tableName: 'rangeCookersInductionCookersHobs', type: 'existing' })),
    ...ovens.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Ovens', tableName: 'ovens', type: 'existing' })),
    ...gnPansAccessories.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'GN Pans & Accessories', tableName: 'gnPansAccessories', type: 'existing' })),
    ...cookware.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Cookware', tableName: 'cookware', type: 'existing' })),
    ...beverageMachines.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Beverage Machines', tableName: 'beverageMachines', type: 'existing' })),
    ...blendersMixers.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Blenders & Mixers', tableName: 'blendersMixers', type: 'existing' })),
    ...slushMachines.map(p => ({ ...p, category: 'Cooking Appliances', subcategory: 'Slush Machines', tableName: 'slushMachines', type: 'existing' })),
    ...allAppliances.map(p => ({ ...p, category: 'Appliances', subcategory: 'All Appliances', tableName: 'allAppliances', type: 'existing' })),
    ...generalEquipment.map(p => ({ ...p, category: 'Kitchenware & Equipment', subcategory: 'General Equipment', tableName: 'generalEquipment', type: 'existing' })),
    ...generalConsumables.map(p => ({ ...p, category: 'Consumables', subcategory: 'General Consumables', tableName: 'generalConsumables', type: 'existing' })),
    ...allFurniture.map(p => ({ ...p, category: 'Kitchen Furniture', subcategory: 'All Furniture', tableName: 'allFurniture', type: 'existing' })),
    ...dishwashersGlasswashers.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Dishwashers & Glasswashers', tableName: 'dishwashersGlasswashers', type: 'existing' })),
    ...hygieneAccessories.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Hygiene Accessories', tableName: 'hygieneAccessories', type: 'existing' })),
    ...laundryMachines.map(p => ({ ...p, category: 'Cleaning', subcategory: 'Laundry Machines', tableName: 'laundryMachines', type: 'existing' })),
    ...allGradedProducts.map(p => ({ ...p, category: 'Graded Equipment', subcategory: 'All Graded Products', tableName: 'allGradedProducts', type: 'existing' })),
    // Add unified products
    ...unifiedProducts.map(p => ({ 
      ...p, 
      productName: p.name,
      category: p.category,
      subcategory: p.subcategory || 'N/A',
      tableName: 'product',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
          <p className="text-gray-600">Manage all your hospitality equipment listings</p>
        </div>
        <Link href="/supplier/create-product">
          <Button className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">All listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedProducts}</div>
            <p className="text-xs text-muted-foreground">Live products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingProducts}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Products Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {product.productImage ? (
                    <img 
                      src={product.productImage} 
                      alt={product.productName || (product as any).name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500">Product Image</span>
                  )}
                </div>
                <CardTitle className="text-lg">{product.productName || (product as any).name}</CardTitle>
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
                                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="flex-1" asChild>
                     <Link href={`/products/${getCategoryUrl(product.category)}/${product.id}`}>
                       <Eye className="w-3 h-3 mr-1" />
                       View
                     </Link>
                   </Button>
                   <Button variant="outline" size="sm" className="flex-1" asChild>
                     <Link href={`/supplier/products/${product.id}/edit`}>
                       <Edit className="w-3 h-3 mr-1" />
                       Edit
                     </Link>
                   </Button>
                   <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                     <Trash2 className="w-3 h-3" />
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  )
} 