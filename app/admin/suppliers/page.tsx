import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Building2, Search, Filter, Eye, Edit, Package, CheckCircle, XCircle } from 'lucide-react'
import prisma from '@/lib/prisma/prisma'

export default async function AdminSuppliersPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  // Get all suppliers
  const suppliers = await prisma.user.findMany({
    where: { role: 'SUPPLIER' },
    orderBy: { createdAt: 'desc' }
  })

  // Get product counts for each supplier
  const suppliersWithProductCounts = await Promise.all(
    suppliers.map(async (supplier) => {
      const productTables = [
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

      let totalProducts = 0
      let approvedProducts = 0
      let pendingProducts = 0

      for (const table of productTables) {
        try {
          const products = await (prisma as any)[table].findMany({
            where: { ownerId: supplier.id }
          })
          
          totalProducts += products.length
          approvedProducts += products.filter((p: any) => p.isApproved).length
          pendingProducts += products.filter((p: any) => !p.isApproved).length
        } catch (error) {
          console.log(`Error counting ${table} for supplier ${supplier.id}:`, error)
        }
      }

      return {
        ...supplier,
        totalProducts,
        approvedProducts,
        pendingProducts
      }
    })
  )

  const totalSuppliers = suppliersWithProductCounts.length
  const totalProducts = suppliersWithProductCounts.reduce((sum, s) => sum + s.totalProducts, 0)
  const totalPendingProducts = suppliersWithProductCounts.reduce((sum, s) => sum + s.pendingProducts, 0)

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-gray-600">Manage equipment suppliers and their products</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-medium">{totalSuppliers} suppliers</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Registered suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Listed products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingProducts}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>
            Manage supplier accounts and their product listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliersWithProductCounts.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                <p className="text-gray-600">There are no suppliers registered yet.</p>
              </div>
            ) : (
              suppliersWithProductCounts.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {supplier.firstName} {supplier.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                      <p className="text-xs text-gray-500">
                        Phone: {supplier.phoneNumber} • Joined {new Date(supplier.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    {/* Product Statistics */}
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{supplier.totalProducts}</span>
                          <span className="text-gray-500">total</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">{supplier.approvedProducts}</span>
                          <span className="text-gray-500">approved</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-4 h-4 text-orange-500" />
                          <span className="font-medium text-orange-600">{supplier.pendingProducts}</span>
                          <span className="text-gray-500">pending</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/suppliers/${supplier.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  )
} 