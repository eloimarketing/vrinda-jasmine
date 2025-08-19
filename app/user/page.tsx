import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ShoppingCart, Package, Heart, Search, Filter } from 'lucide-react'

export default async function CustomerDashboard() {
  const session = await auth()
  if (!session || session.user?.role !== 'CUSTOMER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  // Get user's cart items
  const cartItems = await prisma.cart.findMany({
    where: { userId: session.user.id },
    include: {
      // Note: We'll need to implement a way to get product details from cart items
      // For now, we'll just show the cart count
    }
  })

  const cartCount = cartItems.length

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {session.user.firstName}!</h1>
          <p className="text-gray-600">Browse and purchase hospitality equipment from verified suppliers</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/products">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </Link>
          <Link href="/user/cart">
            <Button>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartCount}</div>
            <p className="text-xs text-muted-foreground">
              Items in your cart
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Equipment categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500+</div>
            <p className="text-xs text-muted-foreground">
              Verified suppliers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/products?category=refrigeration">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Refrigeration</h3>
                <p className="text-sm text-gray-600">7 subcategories</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/products?category=cooking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-medium">Cooking</h3>
                <p className="text-sm text-gray-600">7 subcategories</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/products?category=cleaning">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium">Cleaning</h3>
                <p className="text-sm text-gray-600">3 subcategories</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/products?category=furniture">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Furniture</h3>
                <p className="text-sm text-gray-600">1 subcategory</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Browse Products</h3>
                    <p className="text-sm text-gray-600">Find hospitality equipment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/user/cart">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">View Cart</h3>
                    <p className="text-sm text-gray-600">Check your cart items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/user/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">My Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity or Recommendations */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Browse Products</h3>
                  <p className="text-sm text-gray-600">Explore our wide range of hospitality equipment across 8 categories</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Add to Cart</h3>
                  <p className="text-sm text-gray-600">Select products you need and add them to your cart</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Complete Purchase</h3>
                  <p className="text-sm text-gray-600">Review your cart and complete your purchase securely</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
} 