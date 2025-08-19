import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Package, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma/prisma'
import ApprovalActions from '@/components/admin/approval-actions'

export default async function AdminPendingProductsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  // Get pending products from the unified Product model
  const pendingProducts = await prisma.product.findMany({
    where: { 
      isApproved: false 
    },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      attributes: true
    },
    orderBy: {
      createdAt: 'asc' // Oldest first for approval queue
    }
  })

  const totalPending = pendingProducts.length

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve products from suppliers</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6 text-orange-600" />
          <span className="text-lg font-medium">{totalPending} pending</span>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Approval Queue</h3>
              <p className="text-sm text-gray-600">
                {totalPending} products waiting for admin approval
              </p>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <Clock className="w-4 h-4 mr-1" />
              Pending Review
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pending products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Products */}
      <div className="space-y-6">
        {pendingProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-600">All products have been reviewed and approved.</p>
            </CardContent>
          </Card>
        ) : (
          pendingProducts.map((product) => (
            <Card key={product.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.brand} • {product.subcategory} • {formatCategoryName(product.category)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Image */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : product.productImage ? (
                    <img 
                      src={product.productImage} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Supplier:</span>
                      <span className="text-sm font-medium">
                        {product.owner?.firstName} {product.owner?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge variant="outline" className="text-xs">
                        {formatCategoryName(product.category)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm">{product.owner?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Days in Queue:</span>
                      <span className="text-sm">
                        {Math.ceil((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Description:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/products/${product.category.toLowerCase().replace(/_/g, '-')}/${product.id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </Link>
                  <ApprovalActions 
                    productId={product.id} 
                    category={product.category}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </MaxWidthWrapper>
  )
} 